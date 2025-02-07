// ** Graphql
import pkg from "graphql";
const { GraphQLString, GraphQLFloat, GraphQLNonNull } = pkg;

// ** Types
import shippingType from "../types/shippingType.js";

// ** Models
import Shipping from "../../models/shipping.js";

const shipping = {
  type: shippingType,
  description: "To store values of shipping fees",
  args: {
    id: { type: GraphQLString },
    fees: { type: new GraphQLNonNull(GraphQLFloat) },
    minValue: { type: new GraphQLNonNull(GraphQLFloat) },
    expectedDelivery: { type: new GraphQLNonNull(GraphQLFloat) },
  },
  resolve: async (_, args) => {
    try {
      let response;

      // Checking for id, if not found, creating the shipping
      if (args.id) {
        response = await Shipping.findByIdAndUpdate(
          args.id,
          {
            $set: args,
          },
          { new: true }
        );
      } else {
        // If shipping is already present in database, returning a error
        const isShippingExist = await Shipping.find();

        if (isShippingExist?.length > 0) {
          // Already exist
          return {
            status: 400,
            message: "Shipping already exist",
          };
        } else {
          // Not exist
          response = await Shipping.create(args);
        }
      }

      // If response is null, returning a error, this occurs when id passed in args that is not available in database
      if (response === null) {
        return {
          status: 400,
          message: "Error occurred",
        };
      }

      return {
        ...response.toObject(),
        status: 200,
        message: args.id ? "Updated successfully" : "Added successfully",
      };
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export default shipping;
