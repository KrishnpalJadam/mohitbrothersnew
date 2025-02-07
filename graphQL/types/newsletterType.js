// ** Graphql
import pkg from "graphql";
const { GraphQLObjectType, GraphQLString, GraphQLInt } = pkg;

const newsletterType = new GraphQLObjectType({
  name: "newsletterType",
  description: "To add a contact to newsletter",
  fields: () => ({
    email: { type: GraphQLString },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});

export default newsletterType;
