var createError = require('http-errors');
const cors = require("cors");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const compression = require("compression");

const PORT = process.env.PORT || 3000;

var AuthRoute = require('./routes/UserRoute');
var DepartmentRoute = require('./routes/DepartmentRoute');

var app = express();


app.set("trust proxy", 1); // Trust the first proxy


// app.use(
//   cors({
//     origin: ["http://localhost:3039", "http://localhost:3000"], // Replace with your deployed frontend
//     credentials: true, // Allows cookies and auth headers
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

const allowedOrigins = ["http://localhost:3039", "http://localhost:5173", "http://localhost:3000"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Enable if your app requires cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
  })
);



//performance Middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Optional logging middleware to verify headers
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`Request Origin: ${req.headers.origin}`);
    console.log(
      "Access-Control-Allow-Origin:",
      res.get("Access-Control-Allow-Origin")
    );
  });
  next();
});

app.use(express.json());


// Routes connection
app.use('/api', AuthRoute);
app.use('/api/department', DepartmentRoute);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, 'Not Found'));
});

// Error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
