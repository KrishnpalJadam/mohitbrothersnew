// ** Graphql
import pkg from "graphql";
const {
  GraphQLList,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLFloat,
} = pkg;

// ** Types
import siteSettingsType from "../types/siteSettingsType.js";

// ** Models
import SiteSettings from "../../models/siteSettings.js";

const siteSettings = {
  type: siteSettingsType,
  description: "To update site settings",
  args: {
    id: { type: GraphQLString },
    logo: { type: GraphQLString },
    topbar: { type: GraphQLBoolean },
    topbarContent: { type: GraphQLString },
    topbarStyle: { type: GraphQLString },
    headerLayout: { type: GraphQLString },
    footerLayout: { type: GraphQLString },
    socials: { type: new GraphQLList(GraphQLString) },
    paymentMethods: { type: new GraphQLList(GraphQLString) },
    customerViews: { type: GraphQLBoolean },
    customerViewsNos: { type: new GraphQLList(GraphQLString) },
    customerViewsTimer: { type: GraphQLString },
    soldInLast: { type: GraphQLBoolean },
    soldInLastProducts: { type: new GraphQLList(GraphQLString) },
    soldInLastHours: { type: new GraphQLList(GraphQLString) },
    countdown: { type: GraphQLBoolean },
    countdownText: { type: GraphQLString },
    countdownTimer: { type: GraphQLFloat },
    hotStock: { type: GraphQLBoolean },
    hotStockInventoryLevel: { type: GraphQLFloat },
  },
  resolve: async (_, args) => {
    try {
      let response;

      // Checking for id, if not found, creating the sitesettings
      if (args.id) {
        response = await SiteSettings.findByIdAndUpdate(
          args.id,
          {
            $set: args,
          },
          { new: true }
        );
      } else {
        // If site settings  is already present in database, returning a error
        const isSiteSettingsExist = await SiteSettings.find();

        if (isSiteSettingsExist?.length > 0) {
          // Already exist
          return {
            status: 400,
            message: "Sitesettings already exist",
          };
        } else {
          // Not exist
          response = await SiteSettings.create(args);
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
        message: error,
      };
    }
  },
};

export default siteSettings;
