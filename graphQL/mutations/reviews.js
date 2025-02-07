// ** Graphql
import pkg from "graphql";
const { GraphQLString, GraphQLNonNull } = pkg;

// ** Types
import { productType } from "../types/productType.js";
import { reviewsInputType } from "../types/reviewsType.js";

// ** Models
import Products from "../../models/products.js";
import Reviews from "../../models/reviews.js";

const addProductReview = {
  type: productType,
  description: "To add review of a product",
  args: {
    productId: { type: new GraphQLNonNull(GraphQLString) },
    review: { type: new GraphQLNonNull(reviewsInputType) },
  },
  resolve: async (_, args, context) => {
    try {
      // Customer id
      const customerId = context.req.raw.customer.id;

      const product = await Products.findById(args.productId).populate(
        "reviews",
        "-__v"
      );

      // Check if the customer already reviewed this product
      const isReviewed = product.reviews.some((review) => {
        return (
          review.customer.toString() === customerId &&
          review.orderId === args.review.orderId
        );
      });

      if (isReviewed) {
        return {
          status: 400,
          message: "You already reviewed this product",
        };
      } else {
        // Review
        const review = {
          orderId: args.review.orderId,
          customer: customerId,
          rating: args.review.rating,
          comment: args.review.comment,
          media: args.review.media,
        };

        const response = await Reviews.create(review);

        product.reviews.push(response._id);

        await product.save();

        return {
          status: 200,
          message: "Review added successfully",
        };
      }
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export default addProductReview;
