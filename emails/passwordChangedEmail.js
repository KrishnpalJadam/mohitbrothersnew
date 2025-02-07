// ** Essential imports
import Sib from "sib-api-v3-sdk";

const passwordChangedEmail = (receiver) => {
  const client = Sib.ApiClient.instance;

  const apiKey = client.authentications["api-key"];
  apiKey.apiKey = process.env.SIB_API_KEY;

  const tranEmailApi = new Sib.TransactionalEmailsApi();

  const sender = {
    email: process.env.SIB_SENDER_EMAIL,
    name: process.env.SITENAME,
  };

  const receivers = [
    {
      email: receiver,
    },
  ];

  tranEmailApi
    .sendTransacEmail({
      sender,
      to: receivers,
      subject: "You just changed your password!",
      templateId: 7,
    })
    .then(
      function (data) {
        console.log("data", data);
      },
      function (error) {
        console.error(error);
      }
    );
};

export default passwordChangedEmail;
