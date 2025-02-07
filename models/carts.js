// ** Essential imports
import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true, unique: true },
    products: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        images: { type: [String], required: true },
        price: { type: Number, required: true },
        tax: { type: Number, required: true },
        variantId: { type: String },
        variantName: { type: String },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    createdAt: { type: Date, default: Date.now, expires: 2592000 }, // Automatically delete after 30 days
  },
  { timestamps: true }
);

const Carts = mongoose.model("Carts", CartSchema);

export default Carts;
