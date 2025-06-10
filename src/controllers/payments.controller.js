import Razorpay from "razorpay";
const createPayment = async (req, res) => {
  try {
    const { amount, currency, user } = req.body;
    console.log(amount, currency, user);
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    
    const options = {
      amount: parseInt(amount * 100),
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
