// ** Graphql
import pkg from "graphql";
const { GraphQLList, GraphQLFloat, GraphQLString, GraphQLNonNull } = pkg;

// ** Types
import { cartType } from "../types/cartType.js";

// ** Models
import Cart from "../../models/carts.js";
import Products from "../../models/products.js";

// ** Third party imports
import { v4 as uuidv4 } from "uuid";

export const addToCart = {
  type: cartType,
  description: "To add a item to cart",
  args: {
    cartId: { type: GraphQLString },
    productId: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    images: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      ),
    },
    price: { type: new GraphQLNonNull(GraphQLFloat) },
    tax: { type: new GraphQLNonNull(GraphQLFloat) },
    variantId: { type: GraphQLString },
    variantName: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    try {
      const { cartId, productId, variantId } = args;
      const uuid = uuidv4();

      // Find existing cart / assign customer ID
      const cart = cartId ? await Cart.findById(cartId) : null;
      const customerId =
        cart?.customerId || context.req.raw.customer?.id || uuid;

      // Updating the existing cart
      if (cart) {
        // Check if product exists in cart
        const existingProduct = cart.products.find(
          (product) =>
            product.productId.toString() === productId &&
            (variantId ? product.variantId === variantId : !product.variantId)
        );

        if (existingProduct) {
          // Increase quantity if product exists
          existingProduct.quantity += 1;
        } else {
          // Add new product if it doesn't exist in cart
          cart.products.push({ ...args, quantity: 1 });
        }

        await cart.save();

        return {
          ...cart.toObject(),
          status: 200,
          message: "Successfully updated the cart",
        };
      } else {
        // Create new cart with customer ID and product
        const newCart = await Cart.findOneAndUpdate(
          { customerId },
          {
            $addToSet: { products: { ...args, quantity: 1 } },
          },
          {
            new: true,
            upsert: true, // Create a new document if one doesn't exist
          }
        );

        return {
          ...newCart.toObject(),
          status: 200,
          message: "Successfully created the cart",
        };
      }
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};

export const changeCartQuantity = {
  type: cartType,
  description: "To change a cart item quantity",
  args: {
    cartId: { type: new GraphQLNonNull(GraphQLString) },
    productId: { type: new GraphQLNonNull(GraphQLString) },
    variantId: { type: GraphQLString },
    action: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args) => {
    try {
      const { cartId, productId, variantId, action } = args;

      //  Checking whether the cart is present or not
      const cart = await Cart.findById(cartId);

      if (!cart) {
        return {
          status: 400,
          message: "Cart not found",
        };
      }

      // Find the corresponding product in the cart
      const productInCart = cart.products.find(
        (product) =>
          product.productId.toString() === productId &&
          (variantId ? product.variantId === variantId : !product.variantId)
      );

      if (!productInCart) {
        return { status: 400, message: "Item not available in cart" };
      }

      // Determine available stock
      let totalStocks;

      const currentProduct = await Products.findById(productId);

      if (variantId && currentProduct) {
        const currentVariant = currentProduct.variants.find(
          (variant) => variant._id.toString() === variantId
        );
        totalStocks = currentVariant?.stock ?? currentProduct.stock;
      } else {
        totalStocks = currentProduct?.stock;
      }

      if (totalStocks == null) {
        return { status: 400, message: "Product stock information not found" };
      }

      // Adjust product quantity based on action
      if (action === "decrement") {
        productInCart.quantity = Math.max(1, productInCart.quantity - 1);
      } else if (action === "increment") {
        if (productInCart.quantity >= totalStocks) {
          return {
            status: 400,
            message: `Only ${totalStocks} items available`,
          };
        }
        productInCart.quantity += 1;
      } else {
        return { status: 400, message: "Invalid action specified" };
      }

      await cart.save();

      return {
        ...cart.toObject(),
        status: 200,
        message: "Successfully updated the quantity",
      };
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export const deleteFromCart = {
  type: cartType,
  description: "To delete a product in a cart",
  args: {
    cartId: { type: new GraphQLNonNull(GraphQLString) },
    productId: { type: new GraphQLNonNull(GraphQLString) },
    variantId: { type: GraphQLString },
  },
  resolve: async (_, { cartId, productId, variantId }) => {
    try {
      //  Checking whether the cart is present or not
      const cart = await Cart.findById(cartId);

      if (!cart) {
        return {
          status: 404,
          message: "Cart not found",
        };
      }

      const productIndex = cart.products?.findIndex((product) => {
        if (variantId) {
          return (
            product.productId.toString() === productId &&
            product.variantId === variantId
          );
        } else {
          return (
            product.productId.toString() === productId &&
            product.variantId === undefined
          );
        }
      });

      // Item not found
      if (productIndex === -1) {
        return {
          status: 400,
          message: "Item not found in cart",
        };
      }

      // Remove product from cart
      cart.products.splice(productIndex, 1);

      // Update the cart
      const updatedCart = await cart.save();

      return {
        ...updatedCart.toObject(),
        status: 200,
        message: "Product removed from cart successfully",
      };
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};
