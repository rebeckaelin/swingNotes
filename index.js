require("dotenv").config();
const express = require("express");
const app = express();
const user = require("./user");
const notes = require("./notes");

const swaggerUI = require("swagger-ui-express");
const APIdocs = require("./docs/docs.json");
app.use("/api/docs", swaggerUI.serve);
app.get("/api/docs", swaggerUI.setup(APIdocs));

app.use(express.json());
app.use("/api", user);
app.use("/api", notes);

app.listen(process.env.PORT, process.env.BASE_URL, () => {
  console.log(
    `Server is running on ${process.env.BASE_URL}:${process.env.PORT}`
  );
});
