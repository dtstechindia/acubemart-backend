import Razorpay from "razorpay";
const createPayment = async (req, res) => {
  try {
    const { amount, currency, user } = req.body;
    console.log(amount, currency, user);
    const razorpay = new Razorpay({
      key_id: "rzp_live_b54diYjb2fsFgi",
      key_secret: "2fpwEWmDFhc2cRRsLDrRqyaW",
    });
    const options = {
      amount: amount * 100,
      currency: currency,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

export { createPayment };
