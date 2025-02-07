// ** Graphql
import pkg from "graphql";
const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } = pkg;

// ** Types
import { addressType } from "./addressType.js";
import { productType } from "./productType.js";

export const customerType = new GraphQLObjectType({
  name: "customerType",
  fields: () => ({
    _id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    avatar: { type: GraphQLString },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    gender: { type: GraphQLString },
    dob: { type: GraphQLString },
    address: { type: addressType },
    joinedOn: { type: GraphQLString },
    customerStatus: { type: GraphQLString },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});

export const customersType = new GraphQLObjectType({
  name: "customersType",
  fields: () => ({
    customers: { type: new GraphQLList(customerType) },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});

export const wishlistType = new GraphQLObjectType({
  name: "wishlistType",
  fields: () => ({
    products: { type: new GraphQLList(productType) },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});
