const express = require("express");
require("dotenv").config();
const path = require("path");
const userRauter = require("./routes/userRauter");
const hostRouter = require("./routes/hostRouter");
const errorRouter = require("./routes/errorRauter");
const authRouter = require("./routes/authRouter");
const rootDir = require("./utils/pathUtil");
const session = require("express-session");
const paymentRouter = require("./routes/paymentRoutes");

const { default: mongoose } = require("mongoose");
const multer = require("multer");

// random function for file name

const randomString = (length) => {
  const characters = "qwertyuioplkjhgfdsazxcvbnm";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

//Storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder =
      file.fieldname === "photo" ? "uploads/homeImage" : "uploads/homeRuls";
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10) + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "photo") {
    if (["image/jpg", "image/jpeg", "image/png"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb("only jpeg,jpg,pnng accepted in image ", false);
    }
  } else if (file.fieldname === "homeRuls") {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb("only pdf accepted in home ruls ", false);
    }
  } else {
    console.log("handel hand");
    cb("problem handling in docment", false);
  }
};

// multer
const multerOption = {
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
};

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(rootDir, "public")));
app.use("/uploads", express.static(path.join(rootDir, "uploads")));
app.use("/host/uploads", express.static(path.join(rootDir, "uploads")));
app.use("/home-details/uploads", express.static(path.join(rootDir, "uploads")));
app.use(
  multer(multerOption).fields([
    { name: "photo", maxCount: 1 },
    { name: "homeRuls", maxCount: 1 },
  ]),
);

const MongoDbStore = require("connect-mongodb-session")(session);
const pass = "cherRy78";
const URL = `mongodb://cherryyob:${pass}@ac-ejfildg-shard-00-00.gftiffm.mongodb.net:27017,ac-ejfildg-shard-00-01.gftiffm.mongodb.net:27017,ac-ejfildg-shard-00-02.gftiffm.mongodb.net:27017/airbnb?ssl=true&replicaSet=atlas-inztl9-shard-0&authSource=admin&appName=compliteCoding`;
const store = new MongoDbStore({
  uri: URL,
  collection: "sessions",
});
app.use(express.json());
app.use(express.urlencoded());
app.use(
  session({
    secret:
      "kal mene khana nahi khaya or mene khana kaya pr rat ko kese khaya jaye",
    resave: false,
    saveUninitialized: true,
    store,
  }),
);

app.use(userRauter);
app.use(authRouter);
app.use("/payment", paymentRouter);

app.use("/host", hostRouter);

app.use(errorRouter);
const port = 3000;
app.use((error, req, res, next) => {
  console.log("Global Error Handler Log:", error.message);
  const status = error.httpStatusCode || 500;
  res.status(status).render("500", {
    pageTitle: "Error",
    path: "/500",
    isLoggedIn: req.session?.isLoggedIn || false,
  });
});
mongoose
  .connect(URL)
  .then((rsl) => {
    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
    console.log("connected to mongo:");
  })
  .catch((err) => {
    console.log("error while connecting mongo", err);
  });
