// ** Essential imports
import mongoose from "mongoose";

const StaticPagesSchema = new mongoose.Schema(
  {
    pageName: { type: String },
    pageContent: { type: String },
  },
  { timestamps: true }
);

const StaticPages = mongoose.model("StaticPages", StaticPagesSchema);

export default StaticPages;
