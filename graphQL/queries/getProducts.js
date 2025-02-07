// ** Graphql
import pkg from "graphql";
const {
  GraphQLList,
  GraphQLBoolean,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
} = pkg;

//** Types
import { productsType, productType } from "../types/productType.js";

// ** Models
import Products from "../../models/products.js";

const getSortField = (sortOption) => {
  switch (sortOption) {
    case "Newest":
      return "createdAt";
    case "PriceLowToHigh":
      return "salePrice";
    case "PriceHighToLow":
      return "salePrice";
    default:
      return "createdAt";
  }
};

const getSortDirection = (sortOption) => {
  switch (sortOption) {
    case "PriceLowToHigh":
      return 1;
    case "PriceHighToLow":
      return -1;
    default:
      return -1;
  }
};

export const getProducts = {
  type: productsType,
  description: "To fetch products from database with limit",
  args: {
    page: { type: new GraphQLNonNull(GraphQLInt) },
    limit: { type: new GraphQLNonNull(GraphQLInt) },
    category: { type: new GraphQLList(GraphQLString) },
    priceRange: { type: new GraphQLList(GraphQLString) },
    trending: { type: GraphQLBoolean },
    inStock: { type: GraphQLBoolean },
    sortBy: { type: GraphQLString },
  },
  resolve: async (
    _,
    { category, priceRange, trending, inStock, sortBy, page, limit }
  ) => {
    try {
      let query = {};

      // Filter by category
      if (category?.length > 0) {
        query.category = { $in: category };
      }

      // Filter by price range
      if (priceRange?.length > 0) {
        const priceRangeQueries = priceRange.map((range) => {
          const [minPrice, maxPrice] = range.split("/");
          return {
            salePrice: {
              $gte: parseInt(minPrice),
              $lte: parseInt(maxPrice),
            },
          };
        });

        query.$or = [...priceRangeQueries];
      }

      // Filter by stock availability
      if (inStock) {
        query.stock = { $gt: 0 };
      }

      // Filter by trending
      if (trending) {
        query.trending = trending;
      }

      // Sorting logic
      let sort = {};

      if (sortBy) {
        const sortField = getSortField(sortBy);
        const sortDirection = getSortDirection(sortBy);
        sort[sortField] = sortDirection;
      } else {
        // Default sort
        sort["createdAt"] = -1;
      }

      // Pagination logic
      const skip = page * limit;

      // Fetch products
      const products = await Products.find(query)
        .skip(skip)
        .limit(limit)
        .populate({
          path: "reviews",
          populate: {
            path: "customer",
            model: "Customers",
            select: "firstName lastName",
          },
        })
        .sort(sort);

      const totalCount = await Products.countDocuments(query);

      return { totalCount, products };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};

export const getNewProducts = {
  type: new GraphQLList(productType),
  description: "To fetch new products from database",
  resolve: async () => {
    try {
      const date = new Date();
      const previousMonth = new Date(date.setMonth(date.getMonth() - 1));

      const newProducts = await Products.find({
        createdAt: {
          $gte: previousMonth,
        },
      }).select("name");

      return newProducts;
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  },
};

export const getOutOfStockProducts = {
  type: new GraphQLList(productType),
  description: "To fetch out of stock products from database",
  resolve: async () => {
    try {
      const products = await Products.find({ stock: 0 }).select("name");

      return products;
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  },
};
