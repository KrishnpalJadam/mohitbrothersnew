// ** Graphql
import pkg from "graphql";
const { GraphQLList, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLNonNull } =
  pkg;

// ** Types
import { ordersType, orderCustomerInputType } from "../types/ordersType.js";

// ** Models
import Orders from "../../models/orders.js";
import Cart from "../../models/carts.js";
import Products from "../../models/products.js";

// ** Emails
import orderConfirmationEmail from "../../emails/orderConfirmationEmail.js";
import newOrderRequestEmail from "../../emails/newOrderRequestEmail.js";
import orderDeliveredEmail from "../../emails/orderDeliveredEmail.js";
import orderShippedEmail from "../../emails/orderShippedEmail.js";

export const createOrder = {
  type: ordersType,
  description: "To create a order",
  args: {
    cartId: { type: new GraphQLNonNull(GraphQLString) },
    customer: { type: new GraphQLNonNull(orderCustomerInputType) },
    appliedCoupon: { type: GraphQLString },
    couponDiscount: { type: GraphQLInt },
    paymentMethod: { type: new GraphQLNonNull(GraphQLString) },
    paymentStatus: { type: new GraphQLNonNull(GraphQLString) },
    mrp: { type: new GraphQLNonNull(GraphQLFloat) },
    taxes: { type: new GraphQLNonNull(GraphQLFloat) },
    totalAmount: { type: new GraphQLNonNull(GraphQLFloat) },
    shippingFees: { type: new GraphQLNonNull(GraphQLString) },
    expectedDelivery: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args) => {
    try {
      // Step 1: Fetch the cart and get products & customerId
      const cart = await Cart.findById(args.cartId);

      if (!cart) throw new Error("Cart not found!");

      if (cart.products.length === 0) throw new Error("Cart is empty!");

      // Step 2: Set up order data with cart products and customer ID
      const orderData = {
        ...args,
        customer: { ...args.customer, customerId: cart.customerId },
        products: cart.products,
      };

      // Step 3: Create the order
      const order = await Orders.create(orderData);

      // Step 4: Remove customer cart after successful order
      await Cart.findByIdAndDelete(args.cartId);

      // Step 5: Batch update product stock
      const stockUpdates = cart.products.map(async (product) => {
        const updateQuery = product.variantId
          ? { _id: product.productId, "variants._id": product.variantId }
          : { _id: product.productId };

        // Check if the variant has a stock field
        if (product.variantId) {
          const parentProduct = await Products.findOne(updateQuery, {
            "variants.$": 1,
          });

          if (parentProduct?.variants?.[0]?.stock === undefined) {
            // Fallback to reduce the parent stock if variant stock does not exist
            return Products.updateOne(
              { _id: product.productId },
              { $inc: { stock: -product.quantity } }
            );
          }
        }

        // Default update operation (variant or parent stock)
        const updateOperation = product.variantId
          ? { $inc: { "variants.$.stock": -product.quantity } }
          : { $inc: { stock: -product.quantity } };

        return Products.updateOne(updateQuery, updateOperation);
      });

      await Promise.all(stockUpdates);

      // Step 6: Send order confirmation email to customer and admin
      const customer = order.customer;
      orderConfirmationEmail(order, customer);
      newOrderRequestEmail(order, customer);

      return {
        _id: order._id,
        status: 200,
        message: "Successfully created the order",
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};

export const editOrder = {
  type: ordersType,
  description: "To update a order",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    paymentStatus: { type: GraphQLString },
    deliveryStatus: { type: GraphQLString },
    trackingLink: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    try {
      // Allowing admin to perform this API
      const isAdmin = !!context.req.raw.admins?.id;

      if (!isAdmin) {
        throw new Error("Permission denied");
      }

      const { id, paymentStatus, deliveryStatus, trackingLink } = args;

      // Extract only the fields to be updated
      const updates = {};
      if (paymentStatus) updates.paymentStatus = paymentStatus;
      if (deliveryStatus) updates.deliveryStatus = deliveryStatus;
      if (trackingLink) updates.trackingLink = trackingLink;

      // Updating the order
      const order = await Orders.findByIdAndUpdate(
        id,
        {
          $set: updates,
        },
        { new: true }
      );

      if (!order) {
        throw new Error("Order not found!");
      }

      // Get customer details
      const customer = order.customer;

      // Send order shipment email to customer
      if (order.deliveryStatus === "shipped") {
        orderShippedEmail(order, customer);
      }

      // Send order delivered email to customer
      if (order.deliveryStatus === "delivered") {
        orderDeliveredEmail(order, customer);
      }

      return {
        ...order.toObject(),
        status: 200,
        message: "Successfully updated the order",
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};

export const getOrderById = {
  type: ordersType,
  description: "To get order by order id",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, context) => {
    try {
      // Checking whether the request come from admins or customer
      const { admins, customer } = context.req.raw;
      const isAdmin = !!admins?.id;
      const customerId = customer?.id;

      // Fetching order details
      const order = await Orders.findById(args.id);

      if (!order) {
        throw new Error("Order not found!");
      }

      // Authorization checks
      const isOrderOwner = order.customer.customerId === customerId;
      const isGuestOrder = order.customer.customerId?.split("-")?.length === 5;

      // Allowing admin to access all order
      // Allowing order owner to access their order
      // Allowing guest to access any guest order
      if (
        isAdmin ||
        isOrderOwner ||
        (!isAdmin && !customerId && isGuestOrder)
      ) {
        return order;
      }

      return {
        status: 401,
        message: "Permission denied",
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};

export const getOrdersByCustomerId = {
  type: new GraphQLList(ordersType),
  description: "To get orders by customer id",
  args: {
    customerId: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    try {
      // Checking whether the request come from admins or customer
      const { admins, customer } = context.req.raw;
      const isAdmin = !!admins?.id;
      const requesterCustomerId = customer?.id;

      // Authorization check
      // Allowing admins or specific customer only
      if (!isAdmin && !requesterCustomerId) {
        throw new Error("Unauthorized access: Permission denied");
      }

      // Determine the customerId to fetch orders for
      const queryCustomerId =
        isAdmin && args.customerId ? args.customerId : requesterCustomerId;

      if (!queryCustomerId) {
        throw new Error("Customer ID is required.");
      }

      // Fetching orders
      const orders = await Orders.find({
        "customer.customerId": queryCustomerId,
      }).sort({ createdAt: -1 });

      if (!orders.length) {
        throw new Error("No orders found for the specified customer.");
      }

      return orders;
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};
