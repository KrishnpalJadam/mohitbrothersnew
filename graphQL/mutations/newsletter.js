// ** Graphql
import pkg from "graphql";
const { GraphQLString, GraphQLNonNull } = pkg;

// ** Types
import newsletterType from "../types/newsletterType.js";

// ** SIB
import SibApiV3Sdk from "sib-api-v3-sdk";

const newsletter = {
  type: newsletterType,
  description: "To add a customer email to newsletter",
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args) => {
    try {
      let defaultClient = SibApiV3Sdk.ApiClient.instance;

      let apiKey = defaultClient.authentications["api-key"];

      apiKey.apiKey = process.env.SIB_API_KEY;

      let apiInstance = new SibApiV3Sdk.ContactsApi();

      let createContact = new SibApiV3Sdk.CreateContact();

      createContact.email = args.email;
      createContact.listIds = [2]; // May differ

      const response = await apiInstance.createContact(createContact);

      const contactId = JSON.parse(JSON.stringify(response)).id;

      if (!contactId) {
        throw new Error("Adding the email to newsletter failed");
      }
      return {
        status: 200,
        message: "Added to newsletter successfully",
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  },
};

export default newsletter;
