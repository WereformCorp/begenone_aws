const path = require("path");
const express = require("express");
const morgan = require("morgan");
// const rateLimit = require('express-rate-limit');
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");
// const hpp = require('hpp');
const cookieParser = require("cookie-parser");
const compression = require("compression");
// const bodyParser = require('body-parser');
const dotenv = require("dotenv");

const AppError = require("./src/utils/appError");
const indexRouter = require("./src/routes/indexRoutes");

// Start Express App
const app = express();

// USING CORS
const allowedOrigins = [
  // LOCALHOST MICROSERVICES
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://localhost:3004",
  "http://localhost:3005",
  "http://localhost:3006",
  "http://localhost:3007",
  "http://localhost:3008",
  "http://localhost:3009",
  "http://localhost:3010",
  "http://localhost:3011",
  "http://localhost:3012",
  "http://localhost:3013",
  "http://localhost:3014",

  // LOCALHOST MFE (React frontends)
  "http://localhost:5000",
  "http://localhost:5008",

  // PRODUCTION MICROSERVICES
  "https://begenone.com",
  "https://api-auth.begenone.com",
  "https://api-user.begenone.com",
  "https://api-channel.begenone.com",
  "https://api-subscription.begenone.com",
  "https://api-video.begenone.com",
  "https://api-wire.begenone.com",
  "https://api-aws.begenone.com",

  // PRODUCTION MFE FRONTENDS
  "https://shell.begenone.com",
  "https://video.begenone.com",
  "https://channel.begenone.com",
  "https://home.begenone.com",
  "https://wires.begenone.com",
  "https://upload.begenone.com",
  "https://subscription.begenone.com",
  "https://shared.begenone.com",
  "https://setting.begenone.com",
  "https://clipz.begenone.com",
];

// USING CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS BLOCKED for origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

dotenv.config({
  path: "./config.env",
  // path.join(__dirname, './config.env')
});
console.log(
  `Process Environment Variable 1: `,
  process.env.LOCALHOST_ANALYTICS_URL
);

// Increase the limit to 50MB or more, depending on your needs
app.use(express.json({ limit: "100mb" })); // For JSON bodies
app.use(express.urlencoded({ limit: "100mb", extended: true })); // For URL

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// app.use(
//   cors(
//     {
//       origin: 'http://localhost:5000', // shell domain
//       credentials: true, // REQUIRED to allow cookies
//     },
//     {
//       origin: 'http://localhost:5008', // settings domain
//       credentials: true, // REQUIRED to allow cookies
//     }
//   )
// );

// SET SECURITY HTTP HEADERS
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginOpenerPolicy: false,
    originAgentCluster: false,
  })
);

// Development Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

console.log("Environment:", process.env.NODE_ENV || "development");
console.log("Node Version:", process.version);

// app.use(express.json()); //{ limit: '10kb' }
// app.use(express.urlencoded({ extended: true })); // limit: '10kb'
app.use(cookieParser());

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());
app.use(compression());

// Test Middlewares
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const attachUserToLocals = (req, res, next) => {
  if (req.user) res.locals.user = req.user;
  next();
};

// Apply the middleware to all routes
app.use(attachUserToLocals);

// 3) ROUTE
app.use("/api/v1/aws", indexRouter);
app.get("/", (req, res) => res.status(200).send("OK"));

// eslint-disable-next-line arrow-body-style
app.get("*", (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

module.exports = app;
