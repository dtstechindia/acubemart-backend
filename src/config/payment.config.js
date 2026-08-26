const isConfigured = (value) =>
  typeof value === "string" && value.trim().length > 0;

const getPaymentConfigurationStatus = () => {
  const checks = {
    razorpayKeyId: isConfigured(process.env.RAZORPAY_KEY_ID),
    razorpayKeySecret: isConfigured(process.env.RAZORPAY_KEY_SECRET),
    razorpayWebhookSecret: isConfigured(process.env.RAZORPAY_WEBHOOK_SECRET),
  };

  return {
    ready: Object.values(checks).every(Boolean),
    checks,
  };
};

const logPaymentConfigurationStatus = () => {
  const status = getPaymentConfigurationStatus();

  if (!status.ready) {
    const missing = Object.entries(status.checks)
      .filter(([, configured]) => !configured)
      .map(([name]) => name)
      .join(", ");

    console.error(
      `[payment-readiness] Missing required payment configuration: ${missing}`
    );
  }

  return status;
};

export {
  getPaymentConfigurationStatus,
  isConfigured,
  logPaymentConfigurationStatus,
};
