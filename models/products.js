// ** Essential imports
import mongoose from "mongoose";

// Variant schema
const VariantCombinationSchema = new mongoose.Schema({
  attributes: {
    type: Object,
    required: true,
  },
  images: [String],
  regularPrice: { type: Number },
  salePrice: { type: Number },
  tax: { type: Number },
  stock: { type: Number },
});

// Product schema
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    productType: { type: String, default: "simple" },
    images: { type: [String], required: true },
    regularPrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    variants: [VariantCombinationSchema],
    trending: { type: Boolean, default: false },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reviews" }],
  },
  { timestamps: true }
);

const Products = mongoose.model("Products", ProductSchema);

export default Products;
