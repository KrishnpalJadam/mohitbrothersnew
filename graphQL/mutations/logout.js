//** Types
import { statusType } from "../types/otherType.js";

const logout = {
  type: statusType,
  description: "To logout the admin",
  resolve: async (_, args, context) => {
    try {
      // Clearing access token of admin
      context.req.raw.res.clearCookie("access_token", {
        domain: new URL(process.env.CLIENT_URL1).hostname, // store domain
        path: "/",
      });

      // Clearing role of admin
      context.req.raw.res.clearCookie("role", {
        domain: new URL(process.env.CLIENT_URL1).hostname, // store domain
        path: "/",
      });

      return {
        status: 200,
        message: "Successfully logged out",
      };
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export default logout;
