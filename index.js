require("dotenv").config();
const express = require("express");
const app = express();
const user = require("./user");
const notes = require("./notes");

app.use(express.json());
app.use("/api", user);
app.use("/api", notes);

app.listen(process.env.PORT, process.env.BASE_URL, () => {
  console.log(
    `Server is running on ${process.env.BASE_URL}:${process.env.PORT}`
  );
});
