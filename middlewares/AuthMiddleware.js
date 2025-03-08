// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const ErrorResponse = require("../utils/errorResponse");

const prisma = new PrismaClient();

const userVerification = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return next(new ErrorResponse("Authentication token is missing, User not authorized", 401));
    }

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id } // You forgot the `where` clause in your query!
    });

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    req.user = user;
    next(); // Proceed to the next middleware/route
  } catch (error) {
    next(new ErrorResponse("Not authorized", 401));
  }
};

module.exports = userVerification;

// Role Verification Middleware for 'Host'
