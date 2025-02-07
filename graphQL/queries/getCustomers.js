// ** Graphql
import pkg from "graphql";
const { GraphQLList } = pkg;

// ** Types
import {
  customerType,
  customersType,
  wishlistType,
} from "../types/customerType.js";

// ** Models
import Customers from "../../models/customers.js";

export const getCustomer = {
  type: customerType,
  description: "To get the customer based on customer id",
  resolve: async (_, args, context) => {
    try {
      const customerId = context.req.raw.customer?.id;

      // Fetch the customer by ID
      const customer = await Customers.findById(customerId);

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

export const getCustomers = {
  type: customersType,
  description: "To get all customers",
  resolve: async (_, args, context) => {
    try {
      const isAdmin = !!context.req.raw.admins?.id;

      // Allowing only admins to perform this API
      if (!isAdmin) {
        throw new Error("Permission denied: Unauthorized access");
      }

      // Fetching the customers
      const customers = await Customers.find();

      if (!customers) {
        throw new Error("Customers not found");
      }

      return {
        customers,
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

export const getWishlistProducts = {
  type: wishlistType,
  description: "To fetch new customers from database",
  resolve: async (_, args, context) => {
    try {
      const customerId = context.req.raw.customer?.id;

      // Allowing authenticated customer to view wishlist
      if (!customerId) {
        throw new Error("Login to view wishlist");
      }

      // Fetch the customer by ID
      const customer = await Customers.findById(customerId).populate(
        "wishlist"
      );

      if (!customer || customer.wishlist.length === 0) {
        throw new Error("No products found in your wishlist");
      }

      return {
        products: customer.wishlist,
        status: 200,
        message: "Wishlist products retrieved successfully",
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};

export const getNewCustomers = {
  type: new GraphQLList(customerType),
  description: "To fetch new customers from database",
  resolve: async (_, args, context) => {
    try {
      const isAdmin = !!context.req.raw.admins?.id;

      // Allowing only admins to perform this API
      if (!isAdmin) {
        throw new Error("Permission denied: Unauthorized access");
      }

      // Calculate the start date (one month ago)
      const previousMonth = new Date();
      previousMonth.setMonth(previousMonth.getMonth() - 1);

      // Fetching new customers created in the last month
      const newCustomers = await Customers.find({
        createdAt: {
          $gte: previousMonth,
        },
      }).select("email");

      if (!newCustomers) {
        throw new Error("Error fetching new customers!");
      }

      return newCustomers;
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};

export const getSuspendedCustomers = {
  type: new GraphQLList(customerType),
  description: "To get suspended customers",
  resolve: async (_, args, context) => {
    try {
      const isAdmin = !!context.req.raw.admins?.id;

      // Allowing only admins to perform this API
      if (!isAdmin) {
        throw new Error("Permission denied: Unauthorized access");
      }

      // Fetching the suspended customers
      const suspendedCustomers = await Customers.find({
        customerStatus: "suspended",
      }).select("email");

      if (!suspendedCustomers) {
        throw new Error("Error fetching suspended customers!");
      }

      return suspendedCustomers;
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};
