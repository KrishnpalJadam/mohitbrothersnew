// ** Essential imports
import Stripe from "stripe";

const stripePayment = (app) => {
  app.post("/api/stripe", async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { amount, paymentIntentId, customer } = req.body;

    let paymentIntent_Id = paymentIntentId;

    try {
      let paymentIntent;

      if (paymentIntent_Id) {
        paymentIntent = await stripe.paymentIntents.update(paymentIntent_Id, {
          amount: parseInt(req.body.amount) * 100,
        });
      } else {
        paymentIntent = await stripe.paymentIntents.create({
          amount: parseInt(amount) * 100,
          currency: "inr", // Default currency
          description: "Fabyoh ecommerce demo payments",
          shipping: {
            name: customer.name,
            address: {
              line1: customer.address.address1,
              line2: customer.address.address2 || null,
              city: customer.address.city,
              state: customer.address.state,
              postal_code: customer.address.postal_code,
              country: "IN", // Default country
            },
          },
        });
      }

      const clientSecret = paymentIntent.client_secret;

      const paymentIntentId = paymentIntent.id;

      res.send({
        status: 200,
        message: "Created client secret successfully",
        clientSecret,
        paymentIntentId,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  });
};

export default stripePayment;
