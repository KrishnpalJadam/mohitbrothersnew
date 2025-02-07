// ** Graphql
import pkg from "graphql";
const { GraphQLString, GraphQLNonNull } = pkg;

//** Types
import enquiryType from "../types/enquiryType.js";

//** Send Email
import customerEnquiryEmail from "../../emails/customerEnquiryEmail.js";

const customerEnquiry = {
  type: enquiryType,
  description: "To send customer enquiry",
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    contactNumber: { type: GraphQLString },
    subject: { type: new GraphQLNonNull(GraphQLString) },
    enquiry: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args) => {
    try {
      const details = {
        name: args.name,
        email: args.email,
        contactNumber: args.contactNumber,
        subject: args.subject,
        enquiry: args.enquiry,
      };

      customerEnquiryEmail(details);

      return {
        status: 200,
        message: "Mail sent",
      };
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export default customerEnquiry;
