// ** Essential imports
import mongoose from "mongoose";

const RolesPrivilegesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    privileges: { type: Array, default: [], required: true },
  },
  { timestamps: true }
);

const RolesPrivileges = mongoose.model(
  "RolesPrivileges",
  RolesPrivilegesSchema
);

export default RolesPrivileges;
