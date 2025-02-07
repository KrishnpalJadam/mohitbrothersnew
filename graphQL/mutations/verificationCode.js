// ** Graphql
import pkg from "graphql";
const { GraphQLNonNull, GraphQLString } = pkg;

// ** Types
import { statusType } from "../types/otherType.js";

// ** Models
import Customers from "../../models/customers.js";
import Verifications from "../../models/verifications.js";

// ** Emails
import sendVerificationCodeEmail from "../../emails/sendVerificationCodeEmail.js";

const sendVerificationCode = {
  type: statusType,
  description: "To store and send a verification code to customer",
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, { email }) => {
    try {
      // Step 1: Check if a verification code is already sent and not expired
      const isEmailExist = await Verifications.findOne({ email });

      if (isEmailExist) {
        return {
          status: 400,
          message: "Already email sent or try again after 15 mins",
        };
      }

      // Step 2: Verify the email is associated with a valid customer
      const isCustomer = await Customers.findOne({ email });

      if (!isCustomer) {
        // Customer not found
        return {
          status: 400,
          message: "Please enter a valid registered email",
        };
      }

      // Step 3: Generate a random 6-digit code
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      // Store the verification code in the database
      await Verifications.create({
        email,
        verificationCode,
      });

      // Step 4: Send verification code email to customer
      sendVerificationCodeEmail({ receiver: email, verificationCode });

      return {
        status: 200,
        message: "Verification code sent to your email",
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};

export default sendVerificationCode;
