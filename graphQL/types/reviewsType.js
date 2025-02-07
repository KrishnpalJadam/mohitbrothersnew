// ** Graphql
import pkg from "graphql";
const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLFloat,
} = pkg;

// ** Types
import { customerType } from "./customerType.js";

export const reviewsType = new GraphQLObjectType({
  name: "reviewsType",
  fields: () => ({
    customer: { type: customerType },
    orderId: { type: GraphQLString },
    rating: { type: GraphQLFloat },
    comment: { type: GraphQLString },
    media: { type: GraphQLString },
  }),
});

export const reviewsInputType = new GraphQLInputObjectType({
  name: "reviewsInputType",
  fields: () => ({
    orderId: { type: GraphQLString },
    rating: { type: GraphQLFloat },
    comment: { type: GraphQLString },
    media: { type: GraphQLString },
  }),
});
