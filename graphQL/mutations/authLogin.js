// ** Graphql
import pkg from "graphql";
const { GraphQLString, GraphQLNonNull } = pkg;

// ** Types
import { customerType } from "../types/customerType.js";

// ** Models
import Customers from "../../models/customers.js";
import Carts from "../../models/carts.js";

// ** Third Party Imports
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

const authLogin = {
  type: customerType,
  description: "To login a customer",
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, context) => {
    try {
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

      //if email presents in db, proceeding to next step, else, return a error (email not exist)
      const customer = await Customers.findOne({ email: args.email });

      if (customer) {
        if (customer.customerStatus === "suspended") {
          return {
            status: 400,
            message: "Account suspended",
          };
        }

        if (!customer.password) {
          return {
            status: 400,
            message: "Login with google instead",
          };
        }

        const isPasswordValid = bcrypt.compareSync(
          args.password,
          customer.password
        );

        if (isPasswordValid) {
          const token = await generateAccessToken({
            id: customer._id,
            role: "customer",
          });

          // Clear the cart_id cookie (if any exist)
          context.req.raw.res.clearCookie("cart_id", {
            domain: new URL(process.env.CLIENT_URL1).hostname, // store domain
            path: "/",
          });

          // Setting access token
          setCookie("access_token", token);

          // Checking if customer has a cart
          const isCartAvailable = await Carts.findOne({
            customerId: customer._id,
          });

          const cartId = isCartAvailable?._id?.toString();

          if (cartId) {
            setCookie("cart_id", cartId);
          }

          return {
            status: 200,
            message: "Login success",
          };
        } else {
          return {
            status: 400,
            message: "Incorrect password",
          };
        }
      } else {
        return {
          status: 400,
          message: "Email not exist",
        };
      }
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};

export default authLogin;
