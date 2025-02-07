// ** Essential imports
import Sib from "sib-api-v3-sdk";

const customerEnquiryEmail = ({
  name,
  email,
  contactNumber,
  subject,
  enquiry,
}) => {
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
      email: process.env.SIB_SENDER_EMAIL,
    },
  ];

  const currentDate = new Date().toLocaleDateString();

  tranEmailApi
    .sendTransacEmail({
      sender,
      to: receivers,
      subject: `New Enquiry - ${currentDate}`,
      params: {
        name,
        email,
        contactNumber,
        subject,
        enquiry,
      },
      templateId: 9,
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

export default customerEnquiryEmail;
