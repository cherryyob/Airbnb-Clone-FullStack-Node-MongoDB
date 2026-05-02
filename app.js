const express = require("express");
const path = require("path");
const userRauter = require("./routes/userRauter");
const hostRouter = require("./routes/hostRouter");
const errorRouter = require("./routes/errorRauter");
const rootDir = require("./utils/pathUtil");
const { mongoConnect } = require("./utils/databaseUtil");

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(rootDir, "public")));

app.use(express.urlencoded());

app.use(userRauter);

app.use("/host", hostRouter);

app.use(errorRouter);
const port = 3000;
mongoConnect(() => {
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
});
