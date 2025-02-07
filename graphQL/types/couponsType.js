// ** Graphql
import pkg from "graphql";
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
} = pkg;

const couponsType = new GraphQLObjectType({
  name: "couponsType",
  description: "To store coupons",
  fields: () => ({
    _id: { type: GraphQLString },
    couponCode: { type: GraphQLString },
    couponType: { type: GraphQLString },
    discount: { type: GraphQLFloat },
    limitPerUser: { type: GraphQLFloat },
    minValue: { type: GraphQLFloat },
    maxValue: { type: GraphQLFloat },
    validFrom: { type: GraphQLString },
    validTo: { type: GraphQLString },
    isEnabled: { type: GraphQLBoolean },
    cartValue: { type: GraphQLFloat },
    discount: { type: GraphQLInt },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});

export default couponsType;
