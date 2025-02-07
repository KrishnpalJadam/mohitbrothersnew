// ** Graphql
import pkg from "graphql";
const { GraphQLString, GraphQLList, GraphQLNonNull } = pkg;

// ** Types
import { roleType } from "../types/adminType.js";

// ** Models
import RolesPrivileges from "../../models/rolesPrivileges.js";
import Admins from "../../models/admins.js";

export const rolesPrivileges = {
  type: roleType,
  description: "To add or update a role & privileges",
  args: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    privileges: { type: new GraphQLList(GraphQLString) },
  },
  resolve: async (_, args, context) => {
    try {
      // Role Id, role & privileges
      const roleId = args.id;
      const roleName = args.name;
      const privileges = args.privileges;

      // Allowing only superAdmin to perform this api
      const isSuperAdmin = context.req.raw.admins?.role === "superAdmin";

      if (!isSuperAdmin) {
        return {
          status: "401",
          message: "Permission denied",
        };
      }

      let isRoleExist = await RolesPrivileges.findOne({
        _id: roleId,
      });

      if (!isRoleExist) {
        //Roles & privileges not exist, so, creating the role

        isRoleExist = new RolesPrivileges({
          name: roleName,
          privileges,
        });
      } else {
        // Role already exists, update its properties
        isRoleExist.name = roleName;
        isRoleExist.privileges = privileges;
      }

      await isRoleExist.save();

      return {
        ...isRoleExist.toObject(),
        status: 200,
        message: args.id ? "Role updated" : "Role added",
      };
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  },
};

export const deleteRole = {
  type: roleType,
  description: "To delete a role",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, context) => {
    try {
      // Allowing only superAdmin to perform this api
      const isSuperAdmin = context.req.raw.admins?.role === "superAdmin";

      if (!isSuperAdmin) {
        return {
          status: "401",
          message: "Permission denied",
        };
      }

      const response = await RolesPrivileges.findByIdAndDelete(args.id);

      // Deleting the admins associated with this role
      if (response._id) {
        await Admins.deleteMany({ role: response._id });
      }

      return {
        ...response.toObject(),
        status: 200,
        message: "Deleted successfully",
      };
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  },
};
