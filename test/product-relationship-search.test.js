import assert from "node:assert/strict";
import { after, afterEach, before, test } from "node:test";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import { searchProductRelationshipSources } from "../src/controllers/product.controller.js";
import Brand from "../src/models/brand.model.js";
import Category from "../src/models/category.model.js";
import Element from "../src/models/element.model.js";
import Model from "../src/models/model.model.js";
import Product from "../src/models/product.model.js";
import Type from "../src/models/type.model.js";
import productRouter from "../src/routes/product.route.js";

let mongoServer;
let server;
let serverUrl;

const invokeSearch = async (query) =>
  await new Promise((resolve, reject) => {
    const response = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        resolve({ statusCode: this.statusCode, payload });
      },
    };

    searchProductRelationshipSources({ query }, response, reject);
  });

const createSourceProduct = async () => {
  const type = await Type.create({ name: "Motorcycle" });
  const category = await Category.create({
    name: "Protection",
    typeId: type._id,
  });
  const element = await Element.create({
    name: "Crash Guard",
    categoryId: category._id,
    typeId: type._id,
  });
  const brand = await Brand.create({
    name: "Acube",
    typeId: type._id,
  });
  const model = await Model.create({
    name: "Universal",
    brandId: brand._id,
    typeId: type._id,
  });
  const product = await Product.create({
    name: "Universal Crash Guard Source",
    price: 2999,
    description: "Relationship import source product.",
    stock: 10,
    slug: "universal-crash-guard-source",
    sku: "SOURCE-001",
    barcode: "SOURCE-BARCODE-001",
    isSimpleProduct: true,
    type: [type._id],
    category: [category._id],
    element: [element._id],
    brand: [brand._id],
    model: [model._id],
  });

  return product;
};

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  await Promise.all(
    Object.values(mongoose.models).map((model) => model.init())
  );

  const app = express();
  app.use(express.json());
  app.use("/api/product", productRouter);
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const address = server.address();
  serverUrl = `http://127.0.0.1:${address.port}`;
});

afterEach(async () => {
  const collections = Object.values(mongoose.connection.collections);
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await mongoose.disconnect();
  await mongoServer.stop();
});

test("searches a source product by name and returns populated relationships", async () => {
  const sourceProduct = await createSourceProduct();
  await Product.create({
    name: "Unrelated Product",
    price: 499,
    description: "Does not match the source search.",
    stock: 5,
    slug: "unrelated-product",
    sku: "OTHER-001",
    barcode: "OTHER-BARCODE-001",
    isSimpleProduct: true,
  });

  const result = await invokeSearch({
    query: "Crash Guard Source",
    limit: "15",
  });

  assert.equal(result.statusCode, 200);
  assert.equal(result.payload.data.length, 1);
  assert.equal(result.payload.data[0]._id.toString(), sourceProduct._id.toString());
  assert.equal(result.payload.data[0].type[0].name, "Motorcycle");
  assert.equal(result.payload.data[0].category[0].name, "Protection");
  assert.equal(result.payload.data[0].element[0].name, "Crash Guard");
  assert.equal(result.payload.data[0].brand[0].name, "Acube");
  assert.equal(result.payload.data[0].model[0].name, "Universal");
});

test("searches by exact product ID and excludes the current edit product", async () => {
  const sourceProduct = await createSourceProduct();

  const found = await invokeSearch({
    query: sourceProduct._id.toString(),
  });
  const excluded = await invokeSearch({
    query: sourceProduct._id.toString(),
    excludeId: sourceProduct._id.toString(),
  });

  assert.equal(found.payload.data.length, 1);
  assert.equal(found.payload.data[0]._id.toString(), sourceProduct._id.toString());
  assert.equal(excluded.payload.data.length, 0);
});

test("relationship source URL reaches its named route instead of the ID route", async () => {
  const sourceProduct = await createSourceProduct();
  const response = await fetch(
    `${serverUrl}/api/product/relationship-sources?query=${sourceProduct._id}`
  );
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.data.length, 1);
  assert.equal(payload.data[0]._id.toString(), sourceProduct._id.toString());

  const invalidIdResponse = await fetch(
    `${serverUrl}/api/product/not-a-product-id`
  );
  assert.equal(invalidIdResponse.status, 404);
});
