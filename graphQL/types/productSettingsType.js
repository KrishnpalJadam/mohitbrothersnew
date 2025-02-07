// ** Graphql
import pkg from "graphql";
const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } = pkg;

//** Types
import { variantType } from "./variantType.js";

const productSettingsType = new GraphQLObjectType({
  name: "productSettingsType",
  fields: () => ({
    _id: { type: GraphQLString },
    categories: { type: new GraphQLList(GraphQLString) },
    variants: { type: new GraphQLList(variantType) },
    productCardType: { type: GraphQLString },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});

export default productSettingsType;
