const express = require("express");
const { json } = require("body-parser");

const app = express();
app.use(json());

app.listen(3000, () => {
  console.log("server is listening to port 3000!");
});
