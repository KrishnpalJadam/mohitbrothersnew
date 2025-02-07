// ** Graphql
import pkg from "graphql";
const { GraphQLList, GraphQLString, GraphQLNonNull } = pkg;

// ** Types
import { customerType } from "../types/customerType.js";
import { addressInputType } from "../types/addressType.js";

// ** Models
import Customers from "../../models/customers.js";

export const customers = {
  type: customerType,
  description: "To update a customer",
  args: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    avatar: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    gender: { type: GraphQLString },
    dob: { type: GraphQLString },
    address: { type: addressInputType },
    wishlist: { type: new GraphQLList(GraphQLString) },
    customerStatus: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    try {
      const customerId = context.req.raw.customer?.id;
      const isAdmin = !!context.req.raw.admins?.id;

      // Allowing only respective customer or admin to make changes
      const targetCustomerId = customerId || (isAdmin && args.id);

      if (!targetCustomerId) {
        throw new Error("Permission denied: Unauthorized access");
      }

      // Update the customer
      const updatedCustomer = await Customers.findByIdAndUpdate(
        targetCustomerId,
        { $set: args },
        { new: true }
      );

      if (!updatedCustomer) {
        throw new Error("Customer not found or update failed");
      }

      return {
        ...updatedCustomer.toObject(),
        status: 200,
        message: "Profile updated",
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};

export const getCustomerById = {
  type: customerType,
  description: "To get a customer by id",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, context) => {
    try {
      const isAdmin = !!context.req.raw.admins?.id;

      // Allowing only admins to perform this API
      if (!isAdmin) {
        throw new Error("Permission denied: Unauthorized access");
      }

      // Fetch the customer by ID
      const customer = await Customers.findById(args.id);

      if (!customer) {
        throw new Error("Customer not found");
      }

      return {
        ...customer.toObject(),
        status: 200,
        message: "Customer retrieved successfully",
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};

export const addToWishlist = {
  type: customerType,
  description: "To add a product to customer wishlist",
  args: {
    productId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, { productId }, context) => {
    try {
      const customerId = context.req.raw.customer?.id;

      // Ensure only authenticated customers can add to wishlist
      if (!customerId) {
        return {
          status: 401,
          message: "Please log in to add products to your wishlist.",
        };
      }

      // Adding to wishlist
      const customer = await Customers.findOneAndUpdate(
        { _id: customerId, wishlist: { $ne: productId } },
        { $push: { wishlist: productId } },
        { new: true }
      );

      if (!customer) {
        return {
          status: 200,
          message: "Product already in wishlist",
        };
      }

      return {
        status: 200,
        message: "Product added to wishlist",
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};
