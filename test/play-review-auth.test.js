import assert from "node:assert/strict";
import { after, afterEach, before, test } from "node:test";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import {
  getPlayReviewConfig,
  isPlayReviewPhone,
  isValidPlayReviewOtp,
  normalizeReviewPhone,
} from "../src/config/play-review.config.js";
import {
  loginUserWithPhoneOtp,
  sendOtpToUserPhone,
} from "../src/controllers/user.controller.js";
import User from "../src/models/user.model.js";

const reviewEnv = {
  PLAY_REVIEW_ENABLED: "true",
  PLAY_REVIEW_COUNTRY_CODE: "91",
  PLAY_REVIEW_PHONE: "+91 98765 43210",
  PLAY_REVIEW_OTP: "482731",
};

const originalReviewEnv = {
  PLAY_REVIEW_ENABLED: process.env.PLAY_REVIEW_ENABLED,
  PLAY_REVIEW_COUNTRY_CODE: process.env.PLAY_REVIEW_COUNTRY_CODE,
  PLAY_REVIEW_PHONE: process.env.PLAY_REVIEW_PHONE,
  PLAY_REVIEW_OTP: process.env.PLAY_REVIEW_OTP,
};
const originalFetch = global.fetch;
let mongoServer;

const invokeController = async (controller, body) => {
  let nextError;
  const response = {
    statusCode: 200,
    body: undefined,
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  await controller({ body }, response, (error) => {
    nextError = error;
  });

  return { response, nextError };
};

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  await User.init();
});

afterEach(async () => {
  await User.deleteMany({});
  global.fetch = originalFetch;

  for (const [name, value] of Object.entries(originalReviewEnv)) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

test("review access is disabled unless explicitly enabled", () => {
  const config = getPlayReviewConfig({
    ...reviewEnv,
    PLAY_REVIEW_ENABLED: "false",
  });

  assert.equal(config.enabled, false);
  assert.equal(isValidPlayReviewOtp("9876543210", "482731", {
    ...reviewEnv,
    PLAY_REVIEW_ENABLED: "false",
  }), false);
});

test("review phone accepts equivalent local and +91 formats", () => {
  assert.equal(normalizeReviewPhone("+91 98765-43210", "91"), "9876543210");
  assert.equal(isPlayReviewPhone("9876543210", reviewEnv), true);
  assert.equal(isPlayReviewPhone("+919876543210", reviewEnv), true);
  assert.equal(isPlayReviewPhone("9876543211", reviewEnv), false);
});

test("review OTP only works for the configured phone and exact code", () => {
  assert.equal(isValidPlayReviewOtp("9876543210", "482731", reviewEnv), true);
  assert.equal(isValidPlayReviewOtp("9876543210", "482732", reviewEnv), false);
  assert.equal(isValidPlayReviewOtp("9876543211", "482731", reviewEnv), false);
});

test("invalid review configuration fails closed", () => {
  const config = getPlayReviewConfig({
    ...reviewEnv,
    PLAY_REVIEW_OTP: "1234",
  });

  assert.equal(config.requested, true);
  assert.equal(config.enabled, false);
  assert.match(config.errors.join(" "), /exactly 6 digits/);
});

test("review login skips SMS delivery and accepts the reusable code", async () => {
  Object.assign(process.env, reviewEnv);
  await User.create({
    name: "Google Play Reviewer",
    email: "google-play-review@example.com",
    phone: "9876543210",
  });

  let smsRequests = 0;
  global.fetch = async () => {
    smsRequests += 1;
    throw new Error("The reviewer account must not call the SMS gateway");
  };

  const sendResult = await invokeController(sendOtpToUserPhone, {
    phone: "+91 98765 43210",
  });
  assert.equal(sendResult.nextError, undefined);
  assert.equal(sendResult.response.statusCode, 200);
  assert.equal(sendResult.response.body.success, true);
  assert.equal(sendResult.response.body.data.otp, undefined);
  assert.equal(smsRequests, 0);

  const loginResult = await invokeController(loginUserWithPhoneOtp, {
    phone: "+919876543210",
    otp: "482731",
  });
  assert.equal(loginResult.nextError, undefined);
  assert.equal(loginResult.response.statusCode, 200);
  assert.equal(loginResult.response.body.success, true);
  assert.equal(loginResult.response.body.data.phone, "9876543210");
  assert.equal(loginResult.response.body.data.otp, undefined);

  const invalidResult = await invokeController(loginUserWithPhoneOtp, {
    phone: "9876543210",
    otp: "482732",
  });
  assert.equal(invalidResult.response.body, undefined);
  assert.equal(invalidResult.nextError?.statusCode, 400);
  assert.equal(invalidResult.nextError?.message, "Incorrect OTP");
});
