// ** Graphql
import pkg from "graphql";
const { GraphQLObjectType, GraphQLString, GraphQLInt } = pkg;

const staticPageType = new GraphQLObjectType({
  name: "staticPageType",
  description: "To store values of static pages",
  fields: () => ({
    _id: { type: GraphQLString },
    pageName: { type: GraphQLString },
    pageContent: { type: GraphQLString },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});

export default staticPageType;
