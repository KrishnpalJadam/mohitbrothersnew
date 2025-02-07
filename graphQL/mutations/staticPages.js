// ** Graphql
import pkg from "graphql";
const { GraphQLString, GraphQLNonNull } = pkg;

// ** Types
import staticPageType from "../types/staticPageType.js";

// ** Models
import StaticPages from "../../models/staticPages.js";

export const staticPages = {
  type: staticPageType,
  description: "To store values of static pages",
  args: {
    id: { type: GraphQLString },
    pageName: { type: new GraphQLNonNull(GraphQLString) },
    pageContent: { type: GraphQLString },
  },
  resolve: async (_, args) => {
    try {
      //If page name is already exist, then returning a error
      const isPageExist = await StaticPages.findOne({
        pageName: { $regex: new RegExp(args.pageName, "i") },
      });

      if (isPageExist && !args.id) {
        return {
          status: 400,
          message: "Page already exist",
        };
      }

      // Checking for id, if not found, creating the static page
      let response;

      args.id
        ? (response = await StaticPages.findByIdAndUpdate(
            args.id,
            {
              $set: args,
            },
            { new: true }
          ))
        : (response = await StaticPages.create(args));

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

export const deleteStaticPage = {
  type: staticPageType,
  description: "To delete a static page",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args) => {
    try {
      const response = await StaticPages.findByIdAndDelete(args.id);

      return {
        _id: response._id,
        status: 200,
        message: "Deleted successfully",
      };
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  },
};
