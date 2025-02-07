// ** Essential imports
import mongoose from "mongoose";

const ReviewsSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
    },
    orderId: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    media: {
      type: String,
    },
  },
  { timestamps: true }
);

const Reviews = mongoose.model("Reviews", ReviewsSchema);

export default Reviews;
