// ** Graphql
import pkg from "graphql";
const { GraphQLInputObjectType, GraphQLObjectType, GraphQLString } = pkg;

export const addressType = new GraphQLObjectType({
  name: "addressType",
  fields: () => ({
    address1: { type: GraphQLString },
    address2: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    country: { type: GraphQLString },
    postal_code: { type: GraphQLString },
  }),
});

export const addressInputType = new GraphQLInputObjectType({
  name: "addressInputType",
  fields: () => ({
    address1: { type: GraphQLString },
    address2: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    country: { type: GraphQLString },
    postal_code: { type: GraphQLString },
  }),
});
