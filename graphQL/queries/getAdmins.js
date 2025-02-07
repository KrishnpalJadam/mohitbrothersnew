//** Graphql
import pkg from "graphql";
const { GraphQLList } = pkg;

//** Types
import { adminType } from "../types/adminType.js";

//** Model
import Admins from "../../models/admins.js";

const getAdmins = {
  type: new GraphQLList(adminType),
  description: "To get all admins",
  resolve: async (_, args, context) => {
    try {
      // Allowing only superAdmin to perform this api
      const isSuperAdmin = context.req.raw.admins?.role === "superAdmin";

      if (!isSuperAdmin) {
        return {
          status: 401,
          message: "Permission denied",
        };
      }

      const superAdminId = context.req.raw.admins.id;

      // Returning all admins, except superAdmin
      const admins = await Admins.find({
        _id: { $ne: superAdminId },
      })
        .sort({ createdAt: -1 })
        .populate("role")
        .exec();

      return admins;
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  },
};

export default getAdmins;
