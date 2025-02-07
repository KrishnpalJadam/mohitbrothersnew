// ** Types
import shippingType from "../types/shippingType.js";

// ** Model
import Shipping from "../../models/shipping.js";

const getShipping = {
  type: shippingType,
  description: "To get shipping values",
  resolve: async () => {
    try {
      const shipping = await Shipping.findOne();

      return shipping;
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export default getShipping;
