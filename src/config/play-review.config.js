import crypto from "node:crypto";

const enabledValues = new Set(["1", "true", "yes", "on"]);

const normalizeDigits = (value) => String(value ?? "").replace(/\D/g, "");

const normalizeReviewPhone = (value, countryCode = "91") => {
  const phone = normalizeDigits(value);
  const normalizedCountryCode = normalizeDigits(countryCode);

  if (
    normalizedCountryCode &&
    phone.startsWith(normalizedCountryCode) &&
    phone.length === normalizedCountryCode.length + 10
  ) {
    return phone.slice(normalizedCountryCode.length);
  }

  return phone;
};

const constantTimeEqual = (left, right) => {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));

  return (
    leftBuffer.length === rightBuffer.length &&
    crypto.timingSafeEqual(leftBuffer, rightBuffer)
  );
};

const getPlayReviewConfig = (env = process.env) => {
  const requested = enabledValues.has(
    String(env.PLAY_REVIEW_ENABLED ?? "").trim().toLowerCase()
  );
  const phone = normalizeReviewPhone(
    env.PLAY_REVIEW_PHONE,
    env.PLAY_REVIEW_COUNTRY_CODE
  );
  const otp = String(env.PLAY_REVIEW_OTP ?? "").trim();
  const errors = [];

  if (requested && !/^\d{10}$/.test(phone)) {
    errors.push("PLAY_REVIEW_PHONE must resolve to a 10-digit phone number");
  }
  if (requested && !/^\d{6}$/.test(otp)) {
    errors.push("PLAY_REVIEW_OTP must be exactly 6 digits");
  }

  return {
    requested,
    enabled: requested && errors.length === 0,
    phone,
    otp,
    countryCode: normalizeDigits(env.PLAY_REVIEW_COUNTRY_CODE || "91"),
    name: String(env.PLAY_REVIEW_NAME || "Google Play Reviewer").trim(),
    email: String(
      env.PLAY_REVIEW_EMAIL || "google-play-review@acubemart.in"
    )
      .trim()
      .toLowerCase(),
    errors,
  };
};

const isPlayReviewPhone = (phone, env = process.env) => {
  const config = getPlayReviewConfig(env);
  if (!config.enabled) return false;

  return constantTimeEqual(
    normalizeReviewPhone(phone, config.countryCode),
    config.phone
  );
};

const isValidPlayReviewOtp = (phone, otp, env = process.env) => {
  const config = getPlayReviewConfig(env);
  if (!config.enabled || !isPlayReviewPhone(phone, env)) return false;

  return constantTimeEqual(String(otp ?? "").trim(), config.otp);
};

const logPlayReviewConfigurationStatus = () => {
  const config = getPlayReviewConfig();

  if (!config.requested) {
    console.log("[auth] Google Play review access is disabled");
    return;
  }

  if (!config.enabled) {
    console.error(
      `[auth] Google Play review access is invalid: ${config.errors.join("; ")}`
    );
    return;
  }

  console.log(
    "[auth] Google Play review access is enabled for the configured test account"
  );
};

export {
  getPlayReviewConfig,
  isPlayReviewPhone,
  isValidPlayReviewOtp,
  logPlayReviewConfigurationStatus,
  normalizeReviewPhone,
};
