// ** Essential imports
import mongoose from "mongoose";

const ShippingSchema = new mongoose.Schema(
  {
    fees: { type: Number, required: true },
    minValue: { type: Number, required: true },
    expectedDelivery: { type: Number, required: true },
  },
  { timestamps: true }
);

const Shipping = mongoose.model("Shipping", ShippingSchema);

export default Shipping;
