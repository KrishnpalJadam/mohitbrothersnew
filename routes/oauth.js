// ** Essential imports
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// ** Model
import Customers from "../models/customers.js";
import Carts from "../models/carts.js";

// ** Send Email
import welcomeEmail from "../emails/welcomeEmail.js";

// ** Third Party Imports
import { SignJWT } from "jose";

//** Google Auth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}auth/google/callback/`,
    },
    async (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

export const googleAuth = (app) => {
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: process.env.CLIENT_URL1 + "login",
      session: false,
    }),
    async (req, res) => {
      try {
        // If Google id present, login in the customer, else create or update the customer
        const isGoogle = await Customers.findOne({ googleId: req.user.id });
        const isEmail = await Customers.findOne({
          email: req.user.emails[0].value,
        });

        //checking for suspended customer
        if (isEmail?.customerStatus === "suspended") {
          return res.json({
            status: 400,
            message: "Account suspended",
          });
        }

        const profileData = {
          googleId: req.user.id,
          email: req.user.emails[0].value,
          firstName:
            req.user.name.givenName.split(" ")[0] &&
            req.user.name.givenName.split(" ")[0],
          lastName:
            req.user.name.givenName.split(" ")[1] &&
            req.user.name.givenName.split(" ")[1],
          avatar: req.user.photos[0].value,
        };

        // Generate access token
        const generateAccessToken = (payload) => {
          const iat = Math.floor(Date.now() / 1000);

          return new SignJWT({ ...payload })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt(iat)
            .setNotBefore(iat)
            .setExpirationTime(process.env.JWT_ACCESS_TOKEN_EXPIRY)
            .sign(
              new TextEncoder().encode(process.env.JWT_ACCESS_TOKEN_SECRET)
            );
        };

        // Set Cookies
        const setCookie = (name, value) => {
          res.cookie(name, value, {
            maxAge: 1296000000, // 15 Days in milliseconds
            httpOnly: true,
            secure: true, // Works only on https
            sameSite: "strict", // Works only on https
            domain: new URL(process.env.CLIENT_URL1).hostname, // store domain
          });
        };

        if (isGoogle) {
          //  Creating token
          const payload = {
            id: isGoogle._id,
            role: "customer",
          };

          const accessToken = await generateAccessToken(payload);

          // Setting access token
          setCookie("access_token", accessToken);

          console.log("customer logged in");
        } else {
          if (isEmail) {
            await Customers.findByIdAndUpdate(
              isEmail._id,
              {
                $set: profileData,
              },
              { new: true }
            );

            //  Creating token
            const payload = {
              id: isEmail._id,
              role: "customer",
            };

            const accessToken = await generateAccessToken(payload);

            // Setting access token
            setCookie("access_token", accessToken);

            console.log("customer updated & logged in");
          } else {
            const response = await Customers.create(profileData);

            //  Creating token
            const payload = {
              id: response._id,
              role: "customer",
            };

            const accessToken = await generateAccessToken(payload);

            // Setting access token
            setCookie("access_token", accessToken);

            // send welcome email to customer
            if (response) {
              welcomeEmail(response.email);
            }

            console.log("customer created & logged in");
          }
        }

        // Clear the cart_id cookie
        res.clearCookie("cart_id", {
          domain: new URL(process.env.CLIENT_URL1).hostname, // store domain
          path: "/",
        });

        // Checking if customer has a cart
        const isCartAvailable = await Carts.findOne({
          customerId: isEmail?._id,
        });

        const cartId = isCartAvailable?._id?.toString();

        if (cartId) {
          setCookie("cart_id", cartId);
        }

        // Successful authentication, redirect to home page.
        return res.redirect(process.env.CLIENT_URL1);
      } catch (error) {
        return res.status(500).send(error);
      }
    }
  );
};
