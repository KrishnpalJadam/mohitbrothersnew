//** Types
import siteSettingsType from "../types/siteSettingsType.js";

// ** Models
import SiteSettings from "../../models/siteSettings.js";

const getSiteSettings = {
  type: siteSettingsType,
  description: "To get the site settings value",
  resolve: async () => {
    try {
      const siteSettings = await SiteSettings.findOne();

      return siteSettings;
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export default getSiteSettings;
