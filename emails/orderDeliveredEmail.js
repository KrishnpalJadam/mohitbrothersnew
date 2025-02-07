// ** Essential imports
import Sib from "sib-api-v3-sdk";

const orderDeliveredEmail = (order, customer) => {
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
      email: customer.email,
    },
  ];

  const address = {
    address1: customer.addressLine1,
    address2: customer.addressLine2,
    city: customer.city,
    state: customer.state,
    country: customer.country,
    postal_code: customer.postal_code,
  };

  tranEmailApi
    .sendTransacEmail({
      sender,
      to: receivers,
      subject: "Thank you so much for your order 🧡",
      params: {
        customerName: customer.name,
        orderId: order.id,
        dateOfPurchase: order.dateOfPurchase,
        address: address,
        products: order.products,
        mrp: order.mrp,
        shippingFees: order.shippingFees,
        discount: `-₹${order.couponDiscount}`,
        coupon: order.appliedCoupon,
        totalAmount: order.totalAmount,
        expectedDelivery: order.expectedDelivery,
      },
      templateId: 5,
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

export default orderDeliveredEmail;
