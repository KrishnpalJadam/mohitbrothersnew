// ** Essential imports
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = (app) => {
  app.post("/api/razorpay", async (req, res) => {
    try {
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
      });

      const options = {
        amount: req.body.amount * 100,
        currency: "USD", //Use default currency
      };

      const order = await instance.orders.create(options);

      if (!order) return res.status(500).send("Some error occurred");

      res.json(order);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post("/api/razorpay/success", async (req, res) => {
    try {
      // getting the details back from our font-end
      const {
        orderCreationId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
      } = req.body;

      // Creating our own digest
      // The format should be like this:
      // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
      const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);

      shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

      const digest = shasum.digest("hex");

      // comparing our digest with the actual signature
      if (digest !== razorpaySignature)
        return res.status(400).json({ msg: "Transaction not legit!" });

      // THE PAYMENT IS LEGIT & VERIFIED
      // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

      res.send({
        status: 200,
        message: "Razorpay payment success",
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  });
};

export default razorpay;
