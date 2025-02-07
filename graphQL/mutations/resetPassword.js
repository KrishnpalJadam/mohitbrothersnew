// ** Graphql
import pkg from "graphql";
const { GraphQLString, GraphQLNonNull } = pkg;

// ** Types
import { statusType } from "../types/otherType.js";

// ** Models
import Verifications from "../../models/verifications.js";
import Customers from "../../models/customers.js";

// ** Emails
import passwordChangedEmail from "../../emails/passwordChangedEmail.js";

// ** Third Party Imports
import bcrypt from "bcrypt";

const saltRounds = parseInt(process.env.SALT_ROUNDS);

const resetPassword = {
  type: statusType,
  description: "To reset a password of customer or admin",
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    newPassword: { type: new GraphQLNonNull(GraphQLString) },
    confirmNewPassword: { type: new GraphQLNonNull(GraphQLString) },
    verificationCode: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args) => {
    try {
      // Step 1: Find email and check verification code
      const verificationRecord = await Verifications.findOne({
        email: args.email,
      });

      if (
        !verificationRecord ||
        verificationRecord.verificationCode !== args.verificationCode
      ) {
        return {
          status: 401,
          message: "Invalid or expired verification code.",
        };
      }

      // Step 2: Check if passwords match
      if (args.newPassword !== args.confirmNewPassword) {
        return {
          status: 400,
          message: "New password do not match",
        };
      }

      // Step 3: Hash and update new password
      const hashedPassword = await bcrypt.hash(args.newPassword, saltRounds);

      // Update the customer's password
      await Customers.findOneAndUpdate(
        { email: args.email },
        { password: hashedPassword }
      );

      // Step 4: Delete the verification code
      await Verifications.findOneAndDelete({
        email: args.email,
        verificationCode: args.verificationCode,
      });

      // Step 5: Send password changed email to customer
      passwordChangedEmail(args.email);

      return {
        status: 200,
        message: "Password reset success",
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};

export default resetPassword;
