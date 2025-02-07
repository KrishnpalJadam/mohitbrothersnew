// ** Graphql
import pkg from "graphql";
const { GraphQLString, GraphQLNonNull } = pkg;

// ** Types
import { customerType } from "../types/customerType.js";

// ** Models
import Customers from "../../models/customers.js";

// ** Send Email
import welcomeEmail from "../../emails/welcomeEmail.js";

// ** Third Party Imports
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

const saltRounds = parseInt(process.env.SALT_ROUNDS);

const authRegister = {
  type: customerType,
  description: "To register a customer",
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, context) => {
    try {
      let response;

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

      //if email presents in db, return a error (email already exist), else, proceeding to next step
      const isEmail = await Customers.findOne({ email: args.email });

      if (isEmail) {
        return {
          status: 400,
          message: "Email already exist",
        };
      } else {
        response = await Customers.create({
          email: args.email,
          password: bcrypt.hashSync(args.password, saltRounds),
        });

        const token = await generateAccessToken({
          id: response._id,
          role: "customer",
        });

        // Clear the cart_id cookie
        context.req.raw.res.clearCookie("cart_id", {
          domain: new URL(process.env.CLIENT_URL1).hostname, // store domain
          path: "/",
        });

        // Setting access token
        setCookie("access_token", token);

        // send welcome email to customer
        if (response?.email) {
          welcomeEmail(response.email);
        }

        return {
          status: 201,
          message: "Customer created",
        };
      }
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export default authRegister;
