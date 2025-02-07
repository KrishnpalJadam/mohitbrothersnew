// ** Graphql
import pkg from "graphql";
const { GraphQLNonNull, GraphQLString } = pkg;

//** Types
import { cartType } from "../types/cartType.js";

// ** Models
import Cart from "../../models/carts.js";

const getCart = {
  type: cartType,
  description: "To get the cart based on cart id",
  args: {
    cartId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, { cartId }, context) => {
    try {
      const customerId = context.req.raw.customer?.id;

      let cart;

      // For guests (unauthenticated users), check if the cart belongs to them
      if (!customerId) {
        // For guest users, ensure that cartId belongs to a cart with a UUID customerId
        cart = await Cart.findOne({
          _id: cartId,
          customerId: {
            $regex:
              /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
          }, // UUID format
        });
      } else {
        // For authenticated users, check if the cart belongs to the customer
        cart = await Cart.findOne({ _id: cartId, customerId });
      }

      // Handle case where no cart is found
      if (!cart) {
        throw new Error("Cart not found");
      }

      // Strip sensitive fields before returning the cart data
      const { customerId: _, ...cartData } = cart.toObject();

      return {
        ...cartData,
        status: 200,
        message: "Cart retrieved successfully",
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};

export default getCart;
