// ** Graphql
import pkg from "graphql";
const { GraphQLList } = pkg;

//** Types
import couponsType from "../types/couponsType.js";

// ** Models
import Coupons from "../../models/coupons.js";

const getCoupons = {
  type: new GraphQLList(couponsType),
  description: "To get all coupons",
  resolve: async () => {
    try {
      const coupons = await Coupons.find();

      return coupons;
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export default getCoupons;
