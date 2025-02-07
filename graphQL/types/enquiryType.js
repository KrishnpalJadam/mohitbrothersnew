// ** Graphql
import pkg from "graphql";
const { GraphQLObjectType, GraphQLString, GraphQLInt } = pkg;

const enquiryType = new GraphQLObjectType({
  name: "enquiryType",
  description: "For customer enquiry form",
  fields: () => ({
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    contactNumber: { type: GraphQLString },
    subject: { type: GraphQLString },
    enquiry: { type: GraphQLString },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});

export default enquiryType;
