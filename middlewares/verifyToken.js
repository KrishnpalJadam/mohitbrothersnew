// ** Essential imports
import { jwtVerify } from "jose";

const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;

  const secret = new TextEncoder().encode(process.env.JWT_ACCESS_TOKEN_SECRET);

  if (token) {
    const { payload } = await jwtVerify(token, secret);

    if (payload.role === "customer") {
      req.customer = payload; // Customer
    } else {
      req.admins = payload; // Admins
    }
  }

  next();
};

export default verifyToken;
