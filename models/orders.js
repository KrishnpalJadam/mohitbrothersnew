// ** Essential imports
import mongoose from "mongoose";

const OrdersSchema = new mongoose.Schema(
  {
    customer: {
      customerId: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      address: {
        address1: { type: String, required: true },
        address2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        postal_code: { type: String, required: true },
      },
    },
    products: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        images: { type: [String], required: true },
        price: { type: Number, required: true },
        tax: { type: Number, required: true },
        variantId: { type: String },
        variantName: { type: String },
        quantity: { type: Number, required: true },
      },
    ],
    appliedCoupon: {
      type: String,
    },
    couponDiscount: {
      type: Number,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    deliveryStatus: {
      type: String,
      default: "processing",
    },
    dateOfPurchase: {
      type: String,
      default: new Date(),
    },
    mrp: { type: Number, required: true },
    taxes: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    shippingFees: { type: String, required: true },
    expectedDelivery: { type: String, required: true },
    trackingLink: { type: String, default: null },
  },
  { timestamps: true }
);

const Orders = mongoose.model("orders", OrdersSchema);

export default Orders;
