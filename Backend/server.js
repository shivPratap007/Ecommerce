const express = require("express");
const app = require("./app");
const database = require("./config/database");

// To accept json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Port variable
const port = require("./config/envVariable") || 7000;

// products route
const productRouter = require("./routes/productRoute");
app.use("/api/v1", productRouter);

database(process.env.DATABASE);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/helo", (req, res) => {
  console.log(req.body);
});
