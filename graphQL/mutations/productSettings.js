// ** Graphql
import pkg from "graphql";
const { GraphQLNonNull, GraphQLList, GraphQLString } = pkg;

// ** Types
import productSettingsType from "../types/productSettingsType.js";
import { variantInputType } from "../types/variantType.js";

// ** Models
import { ProductSettings } from "../../models/productSettings.js";

export const productSettings = {
  type: productSettingsType,
  description: "To store values of product settings",
  args: {
    id: { type: GraphQLString },
    categories: { type: new GraphQLList(GraphQLString) },
    productCardType: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    try {
      const isAdmin = !!context.req.raw.admins?.id;

      // Allowing only admins to make changes
      if (!isAdmin) {
        throw new Error("Permission denied: Unauthorized access");
      }

      // Validate categories for duplicates
      if (args.categories) {
        const sanitizedCategories = args.categories
          .map((cat) => cat.trim().toLowerCase()) // Trim and normalize case
          .filter((cat) => cat.length > 0); // Remove empty strings

        const uniqueCategories = new Set(sanitizedCategories);

        if (sanitizedCategories.length !== uniqueCategories.size) {
          throw new Error("Duplicate or invalid categories are not allowed");
        }

        // Replace the original categories with sanitized values
        args.categories = [...uniqueCategories];
      }

      let response;

      // Checking for id, if not found, creating the product settings
      if (args.id) {
        response = await ProductSettings.findByIdAndUpdate(
          args.id,
          {
            $set: args,
          },
          { new: true }
        );
      } else {
        // Check if a product settings entry already exists
        const isProductSettingsExist = await ProductSettings.findOne();

        if (isProductSettingsExist) {
          throw new Error("Product settings already exist");
        } else {
          // Create new product settings
          response = await ProductSettings.create({
            categories: args.categories,
            productCardType: args.productCardType,
          });
        }
      }

      if (!response) {
        throw new Error("Failed to create or update product settings");
      }

      return {
        ...response.toObject(),
        status: 200,
        message: args.id ? "Updated successfully" : "Added successfully",
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};

export const productVariants = {
  type: productSettingsType,
  description: "To store values of product settings (variants)",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    variant: { type: new GraphQLNonNull(variantInputType) },
  },
  resolve: async (_, args, context) => {
    try {
      const isAdmin = !!context.req.raw.admins?.id;

      // Allowing only admins to make changes
      if (!isAdmin) {
        throw new Error("Permission denied: Unauthorized access");
      }

      // Fetch product settings
      const productSettings = await ProductSettings.findById(args.id);

      if (!productSettings) {
        throw new Error("Product settings not found");
      }

      // Ensure the variant name is unique
      const duplicateVariantName = productSettings.variants.some(
        (v) =>
          v.name.toLowerCase() === args.variant.name.toLowerCase() &&
          v._id.toString() !== args.variant.id
      );

      if (duplicateVariantName) {
        throw new Error(`Variant name '${args.variant.name}' already exists`);
      }

      // Existing variant (Edit)
      let existingVariant = null;

      if (args.variant.id) {
        // If variant ID is provided, find the existing variant for editing
        existingVariant = productSettings.variants.find(
          (v) => v._id.toString() === args.variant.id
        );
      }

      if (existingVariant) {
        // Editing an existing variant
        existingVariant.name = args.variant.name;

        // Check for duplicate options
        const seenValues = new Set();

        for (const option of args.variant.options) {
          if (seenValues.has(option.value)) {
            throw new Error(
              `Duplicate option value '${option.value}' found in variant '${args.variant.name}'.`
            );
          }
          seenValues.add(option.value);
        }

        // Assign if no duplicates
        existingVariant.options = args.variant.options;
      } else {
        // Check for duplicate options
        const seenValues = new Set();

        for (const option of args.variant.options) {
          if (seenValues.has(option.value)) {
            throw new Error(
              `Duplicate option value '${option.value}' found in variant '${args.variant.name}'.`
            );
          }

          seenValues.add(option.value);
        }

        // Add new variant if no duplicates
        productSettings.variants.push({
          name: args.variant.name,
          options: args.variant.options,
        });
      }

      // Save changes
      await productSettings.save();

      return {
        ...productSettings.toObject(),
        status: 200,
        message: existingVariant
          ? "Variant updated successfully"
          : "Variant added successfully",
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};

export const deleteProductVariant = {
  type: productSettingsType,
  description: "To delete a product variant",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    variantId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, context) => {
    try {
      const isAdmin = !!context.req.raw.admins?.id;

      // Allowing only admins to make changes
      if (!isAdmin) {
        throw new Error("Permission denied: Unauthorized access");
      }

      // Deleting the variant
      const response = await ProductSettings.findOneAndUpdate(
        { _id: args.id },
        { $pull: { variants: { _id: args.variantId } } },
        { new: true }
      );

      if (!response) {
        throw new Error("Error deleting variant");
      }

      return {
        ...response.toObject(),
        status: 200,
        message: "Deleted variant successfully",
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};
