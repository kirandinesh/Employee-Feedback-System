require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;
const indexRouter = require("./routes/index.routes");
require("./utils/db");
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", "PUT", "DELETE", "GET"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", indexRouter);

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
