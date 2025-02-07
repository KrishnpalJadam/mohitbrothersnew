// ** Essential imports
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    avatar: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    phoneNumber: { type: String },
    gender: { type: String },
    dob: { type: String },
    address: {
      address1: { type: String },
      address2: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postal_code: { type: String },
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
    ],
    joinedOn: { type: String, default: new Date() },
    customerStatus: { type: String, default: "active" },
  },
  { timestamps: true }
);

const Customers = mongoose.model("Customers", customerSchema);

export default Customers;
