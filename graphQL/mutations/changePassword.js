// ** Graphql
import pkg from "graphql";
const { GraphQLString, GraphQLNonNull } = pkg;

// ** Types
import { statusType } from "../types/otherType.js";

// ** Models
import Customers from "../../models/customers.js";
import Admins from "../../models/admins.js";

// ** Third Party Imports
import bcrypt from "bcrypt";

const saltRounds = parseInt(process.env.SALT_ROUNDS);

export const changeCustomerPassword = {
  type: statusType,
  description: "To change password of a customer",
  args: {
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, context) => {
    try {
      const customerId = context.req.raw.customer?.id;

      const newPassword = bcrypt.hashSync(args.password, saltRounds);

      const response = await Customers.findOneAndUpdate(
        { _id: customerId },
        { $set: { password: newPassword } },
        { new: true }
      );

      if (!response) {
        throw new Error("Error changing password");
      }

      return {
        status: 200,
        message: "Password changed",
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};

export const changeAdminPassword = {
  type: statusType,
  description: "To change admin password",
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    newPassword: { type: new GraphQLNonNull(GraphQLString) },
    confirmNewPassword: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, { email, newPassword, confirmNewPassword }, context) => {
    try {
      // Check admin authentication
      const adminId = context.req.raw.admins?.id;

      if (!adminId) {
        throw new Error("Permission denied: Unauthorized access");
      }

      // Validate passwords
      if (newPassword !== confirmNewPassword) {
        throw new Error("Passwords do not match");
      }

      // Fetch admin record
      const admin = await Admins.findOne({ _id: adminId, email });

      if (!admin) {
        throw new Error("Admin not found");
      }

      // Hash and update the password
      const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);

      admin.password = hashedPassword;

      await admin.save();

      // Clearing access token
      context.req.raw.res.clearCookie("access_token");

      // Clearing the role
      context.req.raw.res.clearCookie("role");

      return {
        status: 200,
        message: "Password changed successfully",
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};
