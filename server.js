// ** Essential imports
import "dotenv/config";
import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import schema from "./graphQL/schema.js";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import logosUpload from "./routes/logosUpload.js";
import homeImgUpload from "./routes/homeImgUpload.js";
import productImgUpload from "./routes/productImgUpload.js";
import profileUpload from "./routes/profileUpload.js";
import reviewMediaUpload from "./routes/reviewMediaUpload.js";
import stripePayment from "./routes/stripePayment.js";
import cashfreepayment from "./routes/cashfreepayment.js";
import razorpay from "./routes/razorpay.js";
import { googleAuth } from "./routes/oauth.js";
import verifyToken from "./middlewares/verifyToken.js";

const app = express();
const port = process.env.PORT || 5000;

//  Middlewares
app.use(express.json());

// Cors
app.use(
  cors({
    origin: [process.env.CLIENT_URL1, process.env.CLIENT_URL2],
    credentials: true,
  })
);

// Cookie parser
app.use(cookieParser());

//To verify jwt token
app.use(verifyToken);

// Public folder
app.use(express.static("public"));

// Home
app.get("/", (req, res) => {
  res.send("Hello world");
});

// Graphql
app.all(
  "/graphql",
  (req, res, next) => {
    req.res = res; // attach res to req object
    next();
  },
  createHandler({
    schema,
    context: (req) => {
      return {
        req,
        res: req.res,
      };
    },
  })
);

//  Routes
logosUpload(app);
homeImgUpload(app);
productImgUpload(app);
profileUpload(app);
reviewMediaUpload(app);
stripePayment(app);
razorpay(app);
googleAuth(app);
app.use("/api/payment", cashfreepayment);

//  Mongodb connection
mongoose.set("strictQuery", false);

// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => {
//     console.log("Mongodb DB Connected Successfully 🚀");
//   })
//   .catch((error) => {
//     console.log(error);
//   });

mongoose
  .connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 600000, // Increase timeout duration (in ms)
  })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });


//  Port
app.listen(port, () => {
  console.log(`Backend Server Running On Port ${port} 🚀`);
});
