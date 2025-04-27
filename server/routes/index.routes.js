const express = require("express");
const router = express.Router();
const authRouter = require("./auth-routes/index");
const reviewRouter = require("./review-routes/index");

router.use("/auth", authRouter);
router.use("/review", reviewRouter);

module.exports = router;
