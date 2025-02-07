import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL =
  process.env.CASHFREE_ENV === "sandbox"
    ? "https://sandbox.cashfree.com/pg/orders"
    : "https://api.cashfree.com/pg/orders";

// Ensure environment variables are set
if (!process.env.CASHFREE_CLIENT_ID || !process.env.CASHFREE_SECRET_KEY) {
  console.error("Missing CASHFREE_CLIENT_ID or CASHFREE_SECRET_KEY in .env");
  process.exit(1);
}

export const createPayment = async (req, res) => {
  try {
    const { orderId, amount, customerName, customerEmail, customerPhone } = req.body;

    if (!orderId || !amount || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const payload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: req.body.customerId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: `${process.env.CLIENT_URL}/payment-success?order_id=${orderId}`,
      },
      
      
    };

    const headers = {
      "Content-Type": "application/json",
      "x-client-id": process.env.CASHFREE_CLIENT_ID,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      "x-api-version": "2022-09-01",
    };

    const response = await axios.post(BASE_URL, payload, { headers });

    return res.status(200).json({
      success: true,
      message: "Payment initiated successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Cashfree Payment Error:", error.response?.data || error);
    return res.status(500).json({
      success: false,
      error: error.response?.data || "Payment creation failed",
    });
  }
};