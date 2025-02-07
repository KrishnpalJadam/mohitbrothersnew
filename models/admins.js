// ** Essential imports
import mongoose from "mongoose";

const AdminsSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "RolesPrivileges" },
  },
  { timestamps: true }
);

const Admins = mongoose.model("Admins", AdminsSchema);

export default Admins;
