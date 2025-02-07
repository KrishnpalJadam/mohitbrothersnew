// ** Graphql
import pkg from "graphql";
const { GraphQLObjectType, GraphQLString, GraphQLInt } = pkg;

// Status type
export const statusType = new GraphQLObjectType({
  name: "statusType",
  fields: () => ({
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});
