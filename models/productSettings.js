// ** Essential imports
import mongoose from "mongoose";

// Variant schema
const VariantSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "color", "material"
  options: [
    {
      value: { type: String, required: true },
      meta: { type: String },
    },
  ],
});

// Product settings schema
const ProductSettingsSchema = new mongoose.Schema(
  {
    categories: { type: Array },
    variants: [VariantSchema],
    productCardType: { type: String },
  },
  { timestamps: true }
);

export const ProductSettings = mongoose.model(
  "ProductSettings",
  ProductSettingsSchema
);
