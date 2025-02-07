// ** Essential imports
import mongoose from "mongoose";

const VerificationSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    verificationCode: { type: String, required: true, unique: true },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 900, // Automatically delete after 15 mins
    },
  },
  { timestamps: true }
);

const Verifications = mongoose.model("Verifications", VerificationSchema);

export default Verifications;
