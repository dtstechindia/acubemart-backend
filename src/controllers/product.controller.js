import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Product from "../models/product.model.js";

/* Add New Product */
const addNewProduct = async (req, res, next) => {
  const {
    name,
    price,
    description,
    stock,
    category,
    element,
    brand,
    model,
    type,
    status,
    additionalInfo,
    barcode,
    sku,
    sp,
    video,
    codCharges,
    discount,
    deliveryCharges,
    isSimpleProduct,
  } = req.body;
  
  if (!name || !price || !description || !stock) return next(apiErrorHandler(400, "Please provide all fields"));

  if (!category) return next(apiErrorHandler(404, "Category is required"));

  if (!element) return next(apiErrorHandler(404, "Element is required"));

  if (!type) return next(apiErrorHandler(404, "Type is required"));

  if (!brand) return next(apiErrorHandler(404, "Brand is required"));

  if (!model) return next(apiErrorHandler(404, "Model is required"));

  try {
    //Generating slug for product name as it is unique and remove all special characters
    let slug = name.split(" ")
    //check for special characters and remove them
    .map((word) => {
      return word.replace(/[^a-zA-Z0-9]/g, "-");
    })
    .join("-").toLowerCase();

    //three random numbers and alphabets combination
    slug = slug + "-" + Math.floor(1000 + Math.random() * 9000);

    //Checking if slug already exists
    let slugExists = await Product.findOne({ slug });

    //add unique slug suffix number if slug already exists
    if (slugExists) {
      let newSlug = `${slug}-s${Math.floor(1000 + Math.random() * 9000)}`;
      slug = newSlug;
    }

    const product = await Product.create({
      name,
      price,
      description,
      stock,
      category,
      element,
      brand,
      model,
      type,
      slug,
      status,
      additionalInfo,
      barcode,
      sku,
      sp,
      video,
      codCharges,
      discount,
      deliveryCharges,
      isSimpleProduct,
    });

    if (!product) return next(apiErrorHandler(404, "No Product Found"));

    return res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};


/* Search Products using mongodb search index */
const searchProducts = async (req, res, next) => {
  const { searchQuery } = req.body;
  if (!searchQuery) return next(apiErrorHandler(400, "Please provide a search query"));

  try {
    const products = await Product.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: searchQuery,
            path: ["name",/*  "description", */ "element.name", "model.name"],
            fuzzy: {
              maxEdits: 1,
              prefixLength: 3,

            },
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $limit: 20,
      },
    ]);
    await Product.populate(products, [
      { path: "type", select: "name _id" },
      { path: "category", select: "name description _id" },
      { path: "element", select: "name description _id" },
      { path: "brand", select: "name logo description _id" },
      { path: "model", select: "name description _id" },
      {
        path: "image",
        select: "url isFeatured _id",
        strictPopulate: false,
      },
      {
        path: "attributes",
        select: "name value _id",
        strictPopulate: false,
      },
      {
        path: "variants",
        select: "name mrp sp discount deliveryCharges codCharges video variantAttributes description sku barcode stock _id",
        strictPopulate: false,
        populate: {
          path: "image",
          select: "url _id",
          strictPopulate: false,
        },
      },
      {
        path: "featuredImage",
        select: "url _id",
        strictPopulate: false,
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Products Fetched Successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/* Search Products by mongodb indexed search */
const searchAllMatchedProducts = async (req, res, next) => {
  const { searchQuery } = req.body;
  if (!searchQuery) return next(apiErrorHandler(400, "Please provide a search query"));

  try {
    const products = await Product.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: searchQuery,
            path: ["name", /* "description", */ "element.name", "model.name"],
            fuzzy: {
              maxEdits: 1,
            },
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      /* {
        $limit: 20,
      }, */
    ]);
    await Product.populate(products, [
      { path: "type", select: "name _id" },
      { path: "category", select: "name description _id" },
      { path: "element", select: "name description _id" },
      { path: "brand", select: "name logo description _id" },
      { path: "model", select: "name description _id" },
      {
        path: "image",
        select: "url isFeatured _id",
        strictPopulate: false,
      },
      {
        path: "attributes",
        select: "name value _id",
        strictPopulate: false,
      },
      {
        path: "variants",
        select: "name mrp sp discount deliveryCharges codCharges video variantAttributes description sku barcode stock _id",
        strictPopulate: false,
        populate: {
          path: "image",
          select: "url _id",
          strictPopulate: false,
        },
      },
      {
        path: "featuredImage",
        select: "url _id",
        strictPopulate: false,
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Products Fetched Successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};


const searchPerfectMatchedProducts = async (req, res, next) => {
  const { searchQuery } = req.body;
  if (!searchQuery) return next(apiErrorHandler(400, "Please provide a search query"));

  try {
    const products = await Product.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: searchQuery,
            path: ["name", /* "description", */ "element.name", "model.name"],
            /* fuzzy: {
              maxEdits: 1,
            }, */
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      /* {
        $limit: 20,
      }, */
    ]);
    await Product.populate(products, [
      { path: "type", select: "name _id" },
      { path: "category", select: "name description _id" },
      { path: "element", select: "name description _id" },
      { path: "brand", select: "name logo description _id" },
      { path: "model", select: "name description _id" },
      {
        path: "image",
        select: "url isFeatured _id",
        strictPopulate: false,
      },
      {
        path: "attributes",
        select: "name value _id",
        strictPopulate: false,
      },
      {
        path: "variants",
        select: "name mrp sp discount deliveryCharges codCharges video variantAttributes description sku barcode stock _id",
        strictPopulate: false,
        populate: {
          path: "image",
          select: "url _id",
          strictPopulate: false,
        },
      },
      {
        path: "featuredImage",
        select: "url _id",
        strictPopulate: false,
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Products Fetched Successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};


/* Get All Products count */
const getAllProductsCount = async (req, res, next) => {
  try {
    const count = await Product.countDocuments();
    return res.status(200).json({
      success: true,
      message: "All Products Count",
      data: count,
    });
  } catch (error) {
    next(error);
  }
};

/* Get Published Products count */
const getPublishedProductsCount = async (req, res, next) => {
  try {
    const count = await Product.countDocuments({ status: "published" });
    return res.status(200).json({
      success: true,
      message: "Published Products Count",
      data: count,
    });
  } catch (error) {
    next(error);
  }
};

const getSaleProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({ path: "type", select: "name _id" })
      .populate({ path: "category", select: "name description isActive _id" })
      .populate({ path: "element", select: "name description _id" })
      .populate({ path: "brand", select: "name logo description _id" })
      .populate({ path: "model", select: "name description _id" })
      .populate({
        path: "image",
        select: "url isFeatured _id",
        strictPopulate: false,
      })
      .populate({
        path: "attributes",
        select: "name value _id",
        strictPopulate: false,
      })
      .populate({
        path: "variants",
        select: "name mrp sp discount deliveryCharges codCharges video variantAttributes description sku barcode stock _id",
        strictPopulate: false,
        populate: {
          path: "image",
          select: "url _id",
          strictPopulate: false,
        },
      })
      .populate({
        path: "featuredImage",
        select: "url _id",
        strictPopulate: false,
      });
    if (!products) return next(apiErrorHandler(404, "No Products Found"));
    return res.status(200).json({
      success: true,
      message: "Sale Products Fetched Successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/* Get Paginated Products */
const getPaginatedProducts = async (req, res, next) => {
  let page = req.params.page || 1;
  page = parseInt(page);
  console.log("Page Number:", page);
  const { limit = 12 } = req.query;
  const skip = (page - 1) * limit;
  try {
    const products = await Product.find({ status: "published" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: "type", select: "name _id" })
      .populate({ path: "category", select: "name description isActive _id" })
      .populate({ path: "element", select: "name description _id" })
      .populate({ path: "brand", select: "name logo description _id" })
      .populate({ path: "model", select: "name description _id" })
      .populate({
        path: "image",
        select: "url isFeatured _id",
        strictPopulate: false,
      })
      .populate({
        path: "attributes",
        select: "name value _id",
        strictPopulate: false,
      })
      .populate({
        path: "variants",
        select: "name mrp sp discount deliveryCharges codCharges video variantAttributes description sku barcode stock _id",
        strictPopulate: false,
        populate: {
          path: "image",
          select: "url _id",
          strictPopulate: false,
        },
      })
      .populate({
        path: "featuredImage",
        select: "url _id",
        strictPopulate: false,
      });
    if (!products) return next(apiErrorHandler(404, "No Products Found"));
    return res.status(200).json({
      success: true,
      message: "Products Fetched Successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/* Get All Published Products */
const getAllPublishedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ status: "published" }).sort({ createdAt: -1 })
      .populate({ path: "type", select: "name _id" })
      .populate({ path: "category", select: "name description isActive _id" })
      .populate({ path: "element", select: "name description _id" })
      .populate({ path: "brand", select: "name logo description _id" })
      .populate({ path: "model", select: "name description _id" })
      .populate({
        path: "image",
        select: "url isFeatured _id",
        strictPopulate: false,
      })
      .populate({
        path: "attributes",
        select: "name value _id",
        strictPopulate: false,
      })
      .populate({
        path: "variants",
        select: "name mrp sp discount deliveryCharges codCharges video variantAttributes description sku barcode stock _id",
        strictPopulate: false,
        populate: {
          path: "image",
          select: "url _id",
          strictPopulate: false,
        },
      })
      .populate({
        path: "featuredImage",
        select: "url _id",
        strictPopulate: false,
      });
    if (!products) return next(apiErrorHandler(404, "No Products Found"));

    return res.status(200).json({
      success: true,
      message: "Products Fetched Successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/*  Get All Products */
const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
      .populate({ path: "type", select: "name _id" })
      .populate({ path: "category", select: "name description _id" })
      .populate({ path: "element", select: "name description _id" })
      .populate({ path: "brand", select: "name logo description _id" })
      .populate({ path: "model", select: "name description _id" })
      .populate({
        path: "image",
        select: "url isFeatured _id",
        strictPopulate: false,
      })
      .populate({
        path: "attributes",
        select: "name value _id",
        strictPopulate: false,
      })
      .populate({
        path: "variants",
        select: "name mrp sp discount deliveryCharges codCharges video variantAttributes description sku barcode stock _id",
        strictPopulate: false,
        populate: {
          path: "image",
          select: "url _id",
          strictPopulate: false,
        },
      })
      .populate({
        path: "featuredImage",
        select: "url _id",
        strictPopulate: false,
      });
    if (!products) return next(apiErrorHandler(404, "No Products Found"));

    return res.status(200).json({
      success: true,
      message: "Products Fetched Successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/* Get Product by Id */
const getProductById = async (req, res, next) => {
  const productId = req.params.id;
  if (!productId)
    return next(apiErrorHandler(400, "Please provide all fields"));

  try {
    const product = await Product.findById(productId)
      .populate({ path: "type", select: "name _id" })
      .populate({ path: "category", select: "name description _id" })
      .populate({ path: "element", select: "name description _id" })
      .populate({ path: "brand", select: "name logo description _id" })
      .populate({ path: "model", select: "name description _id" })
      .populate({
        path: "image",
        select: "url isFeatured _id",
        strictPopulate: false,
      })
      .populate({
        path: "attributes",
        select: "name value _id",
        strictPopulate: false,
      })
      .populate({
        path: "variants",
        select: "name mrp sp discount deliveryCharges codCharges video variantAttributes description sku barcode stock _id",
        strictPopulate: false,
        populate: {
          path: "image",
          select: "url _id",
          strictPopulate: false,
        },
      })
      .populate({
        path: "featuredImage",
        select: "url _id",
        strictPopulate: false,
      });
    if (!product) return next(apiErrorHandler(404, "No Product Found"));

    return res.status(200).json({
      success: true,
      message: "Product Fetched Successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const getProductBySlug = async (req, res, next) => {
  const productSlug = req.params.slug;
  console.log(productSlug);
  if (!productSlug) return next(apiErrorHandler(400, "Please provide a slug"));

  try {
    const product = await Product.findOne({ slug: productSlug })
      .populate({ path: "type", select: "name _id" })
      .populate({ path: "category", select: "name description _id" })
      .populate({ path: "element", select: "name description _id" })
      .populate({ path: "brand", select: "name logo description _id" })
      .populate({ path: "model", select: "name description _id" })
      .populate({
        path: "image",
        select: "url isFeatured _id",
        strictPopulate: false,
      })
      .populate({
        path: "attributes",
        select: "name value _id",
        strictPopulate: false,
      })
      .populate({
        path: "variants",
        select: "name mrp sp discount deliveryCharges codCharges video variantAttributes description sku barcode stock _id",
        strictPopulate: false,
        populate: {
          path: "image",
          select: "url _id",
          strictPopulate: false,
        },
      })
      .populate({
        path: "featuredImage",
        select: "url _id",
        strictPopulate: false,
      });
    if (!product) return next(apiErrorHandler(404, "No Product Found"));

    return res.status(200).json({
      success: true,
      message: "Product Fetched Successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/* Edit Product by Id */
const editProductById = async (req, res, next) => {
  const productId = req.params.id;
  if (!productId) return next(apiErrorHandler(400, "Product Id not found"));
  const {
    name,
    price,
    description,
    stock,
    category,
    element,
    brand,
    model,
    type,
    variant,
    additionalInfo,
    attributes,
    status,
    sku,
    barcode,
    sp,
    video,
    codCharges,
    discount,
    deliveryCharges,
    isSimpleProduct
  } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        price,
        description,
        stock,
        category,
        element,
        brand,
        model,
        type,
        variant,
        additionalInfo,
        attributes,
        status,
        sku,
        barcode,
        sp,
        video,
        codCharges,
        discount,
        deliveryCharges,
        isSimpleProduct
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/* Delete Product */
const deleteProductById = async (req, res, next) => {
  const productId = req.params.id;
  if (!productId) return next(apiErrorHandler(400, "Product Id not found"));

  try {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) return next(apiErrorHandler(404, "No Product Found"));
    return res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/* Bulk Edit Products by pushing category Id in products by Id */
const bulkEditProducts = async (req, res, next) => {
  const { products, categoryType, category } = req.body;
  if (!products || !categoryType || !category){
    return next(apiErrorHandler(400, "Please provide all fields"));
  }

  try {
    const updatedProducts = await Product.updateMany(
      { _id: { $in: products } },
      { $addToSet: { [categoryType]: category } }
    );
    return res.status(200).json({
      success: true,
      message: "Products Updated Successfully",
      data: updatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

//Filter Get routes
//todo
/* Get All Products By Type, Category, Brand, Model Id */

export {
  addNewProduct,
  searchProducts,
  searchAllMatchedProducts,
  searchPerfectMatchedProducts,
  getAllProducts,
  getSaleProducts,
  getAllPublishedProducts,
  getAllProductsCount,
  getPublishedProductsCount,
  getPaginatedProducts,
  getProductById,
  getProductBySlug,
  editProductById,
  deleteProductById,
  bulkEditProducts,
};
