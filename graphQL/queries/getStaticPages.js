// ** Graphql
import pkg from "graphql";
const { GraphQLList } = pkg;

//** Types
import staticPageType from "../types/staticPageType.js";

// ** Models
import StaticPages from "../../models/staticPages.js";

const getStaticPages = {
  type: new GraphQLList(staticPageType),
  description: "To fetch all static pages from database",
  resolve: async () => {
    try {
      const staticPages = await StaticPages.find();

      return staticPages;
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export default getStaticPages;
