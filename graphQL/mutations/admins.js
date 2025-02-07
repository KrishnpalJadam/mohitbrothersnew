// ** Graphql
import pkg from "graphql";
const { GraphQLString, GraphQLNonNull } = pkg;

// ** Types
import { adminType } from "../types/adminType.js";

// ** Models
import Admins from "../../models/admins.js";
import RolesPrivileges from "../../models/rolesPrivileges.js";

// ** Third Party Imports
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

const saltRounds = parseInt(process.env.SALT_ROUNDS);

export const adminLogin = {
  type: adminType,
  description: "To sign in admins",
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, context) => {
    try {
      // Admins count
      const admins = await Admins.countDocuments();

      //Checking admin is present in DB or not
      const admin = await Admins.findOne({
        email: args.email,
      })
        .populate("role", "-__v")
        .exec();

      // Generate access token
      const generateAccessToken = (payload) => {
        const iat = Math.floor(Date.now() / 1000);

        return new SignJWT({ ...payload })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt(iat)
          .setNotBefore(iat)
          .setExpirationTime(process.env.JWT_ACCESS_TOKEN_EXPIRY)
          .sign(new TextEncoder().encode(process.env.JWT_ACCESS_TOKEN_SECRET));
      };

      // Set Cookies
      const setCookie = (name, value) => {
        context.req.raw.res.cookie(name, value, {
          maxAge: 1296000000, // 15 Days in milliseconds
          httpOnly: true,
          secure: true, // Works only on https
          sameSite: "strict", // Works only on https
          domain: new URL(process.env.CLIENT_URL1).hostname, // store domain
        });
      };

      // No admins are present, so creating the superAdmin
      if (admins === 0) {
        // Creating the role for superAdmin
        const superAdminRole = await RolesPrivileges.create({
          name: "superAdmin",
          privileges: [],
        });

        const superAdmin = await Admins.create({
          email: args.email,
          password: bcrypt.hashSync(args.password, saltRounds),
          role: superAdminRole._id,
        });

        const payload = {
          id: superAdmin._id,
          role: superAdminRole.name,
          privileges: superAdminRole.privileges,
        };

        // Jose token
        const token = await generateAccessToken(payload);

        // Setting token and privileges as a cookies
        setCookie("access_token", token);
        setCookie(
          "role",
          JSON.stringify({
            role: superAdminRole.name,
            privileges: superAdminRole.privileges,
          })
        );

        return {
          role: {
            name: superAdminRole.name,
            privileges: superAdminRole.privileges,
          },
          status: 201,
          message: "Admin Created",
        };
      } else if (admin) {
        // Admin exist
        const isPasswordValid = bcrypt.compareSync(
          args.password,
          admin.password
        );

        if (isPasswordValid) {
          const payload = {
            id: admin._id,
            role: admin.role.name,
            privileges: admin.role.privileges,
          };

          // Jose token
          const token = await generateAccessToken(payload);

          // Setting token and privileges as a cookies
          setCookie("access_token", token);
          setCookie(
            "role",
            JSON.stringify({
              role: admin.role.name,
              privileges: admin.role.privileges,
            })
          );

          return {
            role: admin.role,
            status: 200,
            message: "Access granted",
          };
        } else {
          return {
            status: 400,
            message: "Invalid Password",
          };
        }
      } else {
        return {
          status: 400,
          message: "Admin not found",
        };
      }
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  },
};

export const admins = {
  type: adminType,
  description: "To create or update admins",
  args: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    role: { type: new GraphQLNonNull(GraphQLString) },
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

      // Checking for admin, if not found, creating the admin
      const admin = await Admins.findById(args.id);

      let result;

      if (admin) {
        // Using the existing password
        args.password = admin.password;

        result = await Admins.findByIdAndUpdate(
          args.id,
          {
            $set: args,
          },
          { new: true }
        )
          .populate("role", "-__v")
          .exec();
      } else {
        // Hashing the password
        args.password = bcrypt.hashSync(args.password, saltRounds);

        const response = await Admins.create(args);

        result = await Admins.findById(response._id)
          .populate("role", "-__v")
          .exec();
      }

      const response = {
        ...result.toObject(),
        status: 200,
        message: args.id ? "Updated successfully" : "Created successfully",
      };

      return response;
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  },
};

export const deleteAdmin = {
  type: adminType,
  description: "To delete a admin",
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

      await Admins.findByIdAndDelete(args.id);

      return {
        _id: args.id,
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
