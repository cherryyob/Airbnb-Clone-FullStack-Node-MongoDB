const express = require("express");
const path = require("path");
const userRauter = require("./routes/userRauter");
const hostRouter = require("./routes/hostRouter");
const errorRouter = require("./routes/errorRauter");
const authRouter = require("./routes/authRouter");
const rootDir = require("./utils/pathUtil");
const session = require("express-session");

const { default: mongoose } = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(rootDir, "public")));

const MongoDbStore = require("connect-mongodb-session")(session);
const pass = "cherRy78";
const URL = `mongodb://cherryyob:${pass}@ac-ejfildg-shard-00-00.gftiffm.mongodb.net:27017,ac-ejfildg-shard-00-01.gftiffm.mongodb.net:27017,ac-ejfildg-shard-00-02.gftiffm.mongodb.net:27017/airbnb?ssl=true&replicaSet=atlas-inztl9-shard-0&authSource=admin&appName=compliteCoding`;
const store = new MongoDbStore({
  uri: URL,
  collection: "sessions",
});

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

app.use("/host", hostRouter);

app.use(errorRouter);
const port = 3000;
app.use((error, req, res, next) => {
  console.log("Global Error Handler Log:", error.message);
  const status = error.httpStatusCode || 500;
  res.status(status).render("500", {
    pageTitle: "Error",
    path: "/500",
    isloggedIn: req.session.isloggedIn,
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
