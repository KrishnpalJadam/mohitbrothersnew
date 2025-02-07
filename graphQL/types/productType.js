// ** Graphql
import pkg from "graphql";
const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
} = pkg;
import { GraphQLJSON } from "graphql-type-json";

//** Types
import { reviewsType } from "./reviewsType.js";

export const productsType = new GraphQLObjectType({
  name: "productsType",
  description: "To fetch all products",
  fields: () => ({
    totalCount: { type: GraphQLInt },
    products: { type: new GraphQLList(productType) },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});

export const productType = new GraphQLObjectType({
  name: "productType",
  description: "To add or edit a product",
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    category: { type: GraphQLString },
    productType: { type: GraphQLString },
    images: { type: new GraphQLList(GraphQLString) },
    regularPrice: { type: GraphQLFloat },
    salePrice: { type: GraphQLFloat },
    tax: { type: GraphQLFloat },
    stock: { type: GraphQLInt },
    variants: { type: new GraphQLList(variantCombinationType) },
    trending: { type: GraphQLBoolean },
    reviews: { type: new GraphQLList(reviewsType) },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});

export const variantCombinationType = new GraphQLObjectType({
  name: "variantCombinationType",
  fields: () => ({
    _id: { type: GraphQLString },
    attributes: { type: GraphQLJSON },
    images: { type: new GraphQLList(GraphQLString) },
    regularPrice: { type: GraphQLFloat },
    salePrice: { type: GraphQLFloat },
    tax: { type: GraphQLFloat },
    stock: { type: GraphQLInt },
  }),
});

export const variantCombinationInputType = new GraphQLInputObjectType({
  name: "variantCombinationInputType",
  fields: () => ({
    _id: { type: GraphQLString },
    attributes: { type: GraphQLJSON },
    images: { type: new GraphQLList(GraphQLString) },
    regularPrice: { type: GraphQLFloat },
    salePrice: { type: GraphQLFloat },
    tax: { type: GraphQLFloat },
    stock: { type: GraphQLInt },
  }),
});
