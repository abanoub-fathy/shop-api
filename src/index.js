const express = require("express");
// connect to db
require("./config/db");

// config express app
const app = express();
app.use(express.json());

// routes
app.use("/products", require("./routes/product"));
app.use("/users", require("./routes/user"));

app.listen(process.env.PORT, console.log(`App is up on ${process.env.PORT}`));
