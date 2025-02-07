// ** Graphql
import pkg from "graphql";
const { GraphQLObjectType, GraphQLString, GraphQLInt } = pkg;

const countType = new GraphQLObjectType({
  name: "countType",
  description: "To get the total count of collection",
  fields: () => ({
    count: { type: GraphQLInt },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});

export default countType;
