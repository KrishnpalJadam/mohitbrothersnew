//** Graphql
import pkg from "graphql";
const { GraphQLList } = pkg;

//** Types
import { roleType } from "../types/adminType.js";

//** Model
import RolesPrivileges from "../../models/rolesPrivileges.js";

const getRolesPrivileges = {
  type: new GraphQLList(roleType),
  description: "To get all roles & privileges",
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

      const rolesPrivileges = await RolesPrivileges.find({
        name: { $ne: "superAdmin" },
      }).sort({
        createdAt: -1,
      });

      return rolesPrivileges;
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  },
};

export default getRolesPrivileges;
