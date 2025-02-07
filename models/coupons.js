// ** Essential imports
import mongoose from "mongoose";

const CouponsSchema = new mongoose.Schema(
  {
    couponCode: { type: String, required: true },
    couponType: { type: String, required: true },
    discount: { type: Number, required: true },
    limitPerUser: { type: Number, required: true },
    maxValue: { type: Number, required: true },
    minValue: { type: Number, required: true },
    validFrom: { type: String, default: new Date() },
    validTo: {
      type: String,
      default: () => {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        return nextWeek;
      },
    },
    isEnabled: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const Coupons = mongoose.model("Coupons", CouponsSchema);

export default Coupons;
