// ** Graphql
import pkg from "graphql";
const { GraphQLString, GraphQLNonNull, GraphQLBoolean, GraphQLFloat } = pkg;

// ** Types
import couponsType from "../types/couponsType.js";

// ** Models
import Coupons from "../../models/coupons.js";
import Orders from "../../models/orders.js";

export const coupons = {
  type: couponsType,
  description: "To add or update coupons",
  args: {
    id: { type: GraphQLString },
    couponCode: { type: new GraphQLNonNull(GraphQLString) },
    couponType: { type: new GraphQLNonNull(GraphQLString) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    limitPerUser: { type: new GraphQLNonNull(GraphQLFloat) },
    maxValue: { type: new GraphQLNonNull(GraphQLFloat) },
    minValue: { type: new GraphQLNonNull(GraphQLFloat) },
    validFrom: { type: GraphQLString },
    validTo: { type: GraphQLString },
    isEnabled: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  resolve: async (_, args) => {
    try {
      let response;

      if (args.maxValue !== 0 && args.minValue > args.maxValue) {
        return {
          status: 400,
          message: "Max.value can't be lower than Min.value",
        };
      }

      if (args.minValue === args.maxValue) {
        return {
          status: 400,
          message: "Max.value and Min.value can't be same",
        };
      }

      //  Checking for id, if not found, creating the coupon
      args.id
        ? (response = await Coupons.findByIdAndUpdate(
            args.id,
            {
              $set: args,
            },
            { new: true }
          ))
        : (response = await Coupons.create(args));

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

export const deleteCoupon = {
  type: couponsType,
  description: "To delete a coupon",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args) => {
    try {
      const response = await Coupons.findByIdAndDelete(args.id);

      // If response is null, returning a error, this occurs when id passed in args that is not available in database
      if (response === null) {
        return {
          status: 400,
          message: "Error occurred",
        };
      }

      return {
        _id: response._id,
        status: 200,
        message: "Deleted successfully",
      };
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export const checkCoupon = {
  type: couponsType,
  description: "To check a coupon availability",
  args: {
    couponCode: { type: new GraphQLNonNull(GraphQLString) },
    cartValue: { type: new GraphQLNonNull(GraphQLFloat) },
  },
  resolve: async (_, args, context) => {
    try {
      let customerId;

      // Checking the user is logged or guest user
      // For guest users, coupon limit per user won't work
      if (context.req.raw.customer) {
        customerId = context.req.raw.customer.id;
      } else {
        customerId = null;
      }

      const coupon = await Coupons.findOne({ couponCode: args.couponCode });

      // To check is available or not
      if (!coupon || coupon.isEnabled === false) {
        return {
          status: 400,
          message: "Coupon is not available",
        };
      }

      const formatDate = (date) => {
        return new Date(date);
      };

      // Purchases of the user to find how many times, user used this coupon or how many they ordered.
      const orders = await Orders.find({ "customer.customerId": customerId });

      const cartValue = args.cartValue;
      const minValue = coupon.minValue;
      const maxValue = coupon.maxValue;
      const limitPerUser = coupon.limitPerUser;
      const discount = coupon.discount;
      const date = new Date();
      const validFrom = formatDate(coupon.validFrom);
      const validTo = formatDate(coupon.validTo);

      // coupon date & min,max value validation
      if (date > validFrom && date < validTo) {
        console.log("date is between the 2 dates");

        if (maxValue === 0) {
          if (cartValue > minValue) {
            console.log("cart value higher than min value");
          } else {
            console.log("cart value should be higher than minValue");
            return {
              status: 400,
              message: `Cart value should be higher than ${coupon.minValue}`,
            };
          }
        } else {
          if (cartValue > minValue && cartValue < maxValue) {
            console.log("cart value is between min and max value");
          } else {
            console.log("cart value should be between minValue and maxValue");
            return {
              status: 400,
              message: `Cart value should be between ${coupon.minValue}$ and ${coupon.maxValue}$}`,
            };
          }
        }
      } else {
        console.log("date is not in the range");
        return {
          status: 400,
          message: "Coupon Expired",
        };
      }

      // To check coupon available for this user or not
      const couponsLimit = orders.filter((order) => {
        return order.appliedCoupon === coupon.couponCode;
      });

      if (coupon.couponType === "firstTimePurchase") {
        if (orders.length > 0) {
          return {
            status: 400,
            message: "This coupon is applicable for first time purchase only",
          };
        }
      } else {
        if (couponsLimit.length >= limitPerUser) {
          return {
            status: 400,
            message: "You have already used this coupon",
          };
        }
      }

      return {
        couponCode: args.couponCode,
        discount,
        status: 200,
        message: "Coupon applied",
      };
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};
