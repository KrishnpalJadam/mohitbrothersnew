// ** Graphql
import pkg from "graphql";
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLFloat,
  GraphQLInt,
  GraphQLString,
} = pkg;

export const cartType = new GraphQLObjectType({
  name: "cartType",
  fields: () => ({
    _id: { type: GraphQLString },
    products: { type: new GraphQLList(cartItemType) },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});

export const cartItemType = new GraphQLObjectType({
  name: "cartItemType",
  fields: () => ({
    productId: { type: GraphQLString },
    name: { type: GraphQLString },
    images: { type: new GraphQLList(GraphQLString) },
    price: { type: GraphQLFloat },
    tax: { type: GraphQLInt },
    variantId: { type: GraphQLString },
    variantName: { type: GraphQLString },
    quantity: { type: GraphQLInt },
  }),
});
