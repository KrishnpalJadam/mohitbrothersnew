// ** Types
import productSettingsType from "../types/productSettingsType.js";

// ** Model
import { ProductSettings } from "../../models/productSettings.js";

const getProductSettings = {
  type: productSettingsType,
  description: "To get product settings values",
  resolve: async () => {
    try {
      const productSettings = await ProductSettings.findOne();

      if (!productSettings) {
        throw new Error("Error fetching product settings");
      }

      return productSettings;
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};

export default getProductSettings;
