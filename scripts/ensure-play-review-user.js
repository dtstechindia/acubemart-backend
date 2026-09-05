import "dotenv/config";
import mongoose from "mongoose";

import { getPlayReviewConfig } from "../src/config/play-review.config.js";
import ConnectDB from "../src/db/connection.db.js";
import User from "../src/models/user.model.js";

const ensurePlayReviewUser = async () => {
  const config = getPlayReviewConfig();

  if (!config.enabled) {
    const reason = config.errors.length
      ? config.errors.join("; ")
      : "PLAY_REVIEW_ENABLED is not true";
    throw new Error(`Google Play review access is not configured: ${reason}`);
  }

  if (!config.email || !config.email.includes("@")) {
    throw new Error("PLAY_REVIEW_EMAIL must be a valid dedicated email address");
  }

  await ConnectDB();

  const [userByPhone, userByEmail] = await Promise.all([
    User.findOne({ phone: config.phone }),
    User.findOne({ email: config.email }),
  ]);

  if (
    userByPhone &&
    userByEmail &&
    userByPhone._id.toString() !== userByEmail._id.toString()
  ) {
    throw new Error(
      "PLAY_REVIEW_PHONE and PLAY_REVIEW_EMAIL belong to different users"
    );
  }

  const user = userByPhone || userByEmail || new User();
  user.name = config.name;
  user.email = config.email;
  user.phone = config.phone;
  user.status = "active";
  user.otp = undefined;
  await user.save();

  console.log(
    `[auth] Google Play review user is ready (id: ${user._id.toString()})`
  );
};

try {
  await ensurePlayReviewUser();
} catch (error) {
  console.error(`[auth] Failed to prepare Google Play review user: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
