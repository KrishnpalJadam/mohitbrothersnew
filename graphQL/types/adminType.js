// ** Graphql
import pkg from "graphql";
const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } = pkg;

export const adminType = new GraphQLObjectType({
  name: "adminType",
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: roleType },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});

export const roleType = new GraphQLObjectType({
  name: "roleType",
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    privileges: { type: new GraphQLList(GraphQLString) },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});
