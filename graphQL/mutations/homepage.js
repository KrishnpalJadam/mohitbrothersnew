// ** Graphql
import pkg from "graphql";
const { GraphQLList, GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLFloat } =
  pkg;

// ** Types
import homepageType from "../types/homepageType.js";

// ** Models
import Homepage from "../../models/homepage.js";

const homepage = {
  type: homepageType,
  description: "To add or update homepage values",
  args: {
    id: { type: GraphQLString },
    heroType: { type: GraphQLString },
    heroImagesLarge: { type: new GraphQLList(GraphQLString) },
    heroImagesSmall: { type: new GraphQLList(GraphQLString) },
    heroHeading: { type: GraphQLString },
    heroSubHeading: { type: GraphQLString },
    heroBtnText: { type: GraphQLString },
    heroLink: { type: GraphQLString },
    heroCountdown: { type: GraphQLFloat },
    heroCountdownText: { type: GraphQLString },
    marquee: { type: GraphQLBoolean },
    marqueeText: { type: GraphQLString },
    subHeroTitle: { type: GraphQLString },
    subHeroImages: { type: new GraphQLList(GraphQLString) },
    subHeroHeading: { type: new GraphQLList(GraphQLString) },
    subHeroBtnText: { type: new GraphQLList(GraphQLString) },
    subHeroLink: { type: new GraphQLList(GraphQLString) },
    riskReducersImages: { type: new GraphQLList(GraphQLString) },
    riskReducersHeading: { type: new GraphQLList(GraphQLString) },
    riskReducersText: { type: new GraphQLList(GraphQLString) },
    spotlight1: { type: GraphQLBoolean },
    spotlight1Image: { type: GraphQLString },
    spotlight1Link: { type: GraphQLString },
    spotlight2: { type: GraphQLBoolean },
    spotlight2Image: { type: GraphQLString },
    spotlight2Link: { type: GraphQLString },
    categoryTitle: { type: GraphQLString },
    categoryImages: { type: new GraphQLList(GraphQLString) },
    categoryHeading: { type: new GraphQLList(GraphQLString) },
    categoryText: { type: new GraphQLList(GraphQLString) },
    categoryLink: { type: new GraphQLList(GraphQLString) },
    newsletter: { type: GraphQLBoolean },
    newsletterHeading: { type: GraphQLString },
    newsletterText: { type: GraphQLString },
    newsletterBtnText: { type: GraphQLString },
    newsletterSuccessHeading: { type: GraphQLString },
    newsletterSuccessText: { type: GraphQLString },
    trending: { type: GraphQLBoolean },
    trendingLimit: { type: GraphQLInt },
  },
  resolve: async (_, args) => {
    try {
      let response;

      // Checking for id, if not found, creating the homepage
      if (args.id) {
        response = await Homepage.findByIdAndUpdate(
          args.id,
          {
            $set: args,
          },
          { new: true }
        );
      } else {
        // If homepage is already present in database, returning a error
        const isHomepageExist = await Homepage.find();

        if (isHomepageExist?.length > 0) {
          // Already exist
          return {
            status: 400,
            message: "Homepage already exist",
          };
        } else {
          // Not exist
          response = await Homepage.create(args);
        }
      }

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
        message: error.message,
      };
    }
  },
};

export default homepage;
