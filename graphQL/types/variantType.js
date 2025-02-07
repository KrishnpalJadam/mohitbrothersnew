// ** Graphql
import pkg from "graphql";
const {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
} = pkg;

export const variantType = new GraphQLObjectType({
  name: "variantType",
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    options: { type: new GraphQLList(variantOptionType) },
  }),
});

const variantOptionType = new GraphQLObjectType({
  name: "variantOptionType",
  fields: () => ({
    _id: { type: GraphQLString },
    value: { type: GraphQLString },
    meta: { type: GraphQLString },
  }),
});

export const variantInputType = new GraphQLInputObjectType({
  name: "variantInputType",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    options: { type: new GraphQLList(variantOptionInputType) },
  }),
});

const variantOptionInputType = new GraphQLInputObjectType({
  name: "variantOptionInputType",
  fields: () => ({
    _id: { type: GraphQLString },
    value: { type: GraphQLString },
    meta: { type: GraphQLString },
  }),
});
