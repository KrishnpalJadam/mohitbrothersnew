// ** Graphql
import pkg from "graphql";
const {
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLNonNull,
} = pkg;

// ** Types
import {
  productType,
  variantCombinationInputType,
} from "../types/productType.js";

// ** Models
import Products from "../../models/products.js";

export const products = {
  type: productType,
  description: "To add or update products",
  args: {
    id: { type: GraphQLString },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    category: { type: new GraphQLNonNull(GraphQLString) },
    productType: { type: new GraphQLNonNull(GraphQLString) },
    images: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      ),
    },
    regularPrice: { type: new GraphQLNonNull(GraphQLFloat) },
    salePrice: { type: new GraphQLNonNull(GraphQLFloat) },
    tax: { type: GraphQLFloat },
    stock: { type: GraphQLInt },
    variants: { type: new GraphQLList(variantCombinationInputType) },
  },
  resolve: async (_, args) => {
    try {
      let response;

      // Checking whether sale price is lesser than regular price or not
      if (args.salePrice > args.regularPrice) {
        return {
          status: 400,
          message: "Sale price can't be greater than regular price",
        };
      }

      // Checking whether sale price is lesser than regular price or not (Variants)
      if (args.productType === "variable") {
        for (let i = 0; i < args.variants?.length; i++) {
          if (args.variants[i].salePrice > args.variants[i].regularPrice) {
            return {
              status: 400,
              message: "Sale price can't be greater than regular price",
            };
          }
        }
      }

      // Checking for id, if not found, creating the product
      if (args.id) {
        response = await Products.findByIdAndUpdate(
          args.id,
          {
            $set: args,
          },
          { new: true }
        );
      } else {
        // Checking the name is already exist or not
        const isTitleExist = await Products.findOne({
          name: { $regex: `^${args.name}$`, $options: "i" },
        });

        if (isTitleExist) {
          return {
            status: 400,
            message: "Please use different name!",
          };
        }

        response = await Products.create(args);
      }

      // If response is null, returning a error
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

export const getProductById = {
  type: productType,
  description: "To fetch product based on id",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args) => {
    try {
      const product = await Products.findById(args.id);

      return product;
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  },
};

export const getProductByName = {
  type: productType,
  description: "To fetch a product by name",
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, { name }) => {
    try {
      // Removing any hyphens with spaces to match database naming conventions
      const formattedName = name.replace(/-/g, " ");

      const product = await Products.findOne({
        name: { $regex: new RegExp(formattedName, "i") },
      }).populate({
        path: "reviews",
        populate: {
          path: "customer",
          model: "Customers",
          select: "firstName lastName",
        },
      });

      return product;
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  },
};

export const getProductsByCategory = {
  type: new GraphQLList(productType),
  description: "To fetch products depending on category ",
  args: {
    category: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args) => {
    try {
      const products = await Products.find({
        category: args.category,
      }).populate({
        path: "reviews",
        populate: {
          path: "customer",
          model: "Customers",
          select: "firstName lastName",
        },
      });

      return products;
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export const setTrendingProduct = {
  type: productType,
  description: "To set a trending product",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    trending: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  resolve: async (_, args) => {
    try {
      const response = await Products.findByIdAndUpdate(
        args.id,
        {
          $set: args,
        },
        { new: true }
      );

      return {
        _id: response._id,
        trending: response.trending,
        status: 200,
        message: "Success",
      };
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export const deleteProduct = {
  type: productType,
  description: "To delete a product",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args) => {
    try {
      const response = await Products.findByIdAndDelete(args.id);

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
