// ** Graphql
import pkg from "graphql";
const { GraphQLObjectType, GraphQLFloat, GraphQLString, GraphQLInt } = pkg;

const shippingFeesType = new GraphQLObjectType({
  name: "shippingFeesType",
  description: "To store values of shipping values",
  fields: () => ({
    _id: { type: GraphQLString },
    fees: { type: GraphQLFloat },
    minValue: { type: GraphQLFloat },
    expectedDelivery: { type: GraphQLFloat },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});

export default shippingFeesType;
