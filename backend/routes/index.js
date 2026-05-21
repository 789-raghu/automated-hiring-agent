const express = require("express");
const router = express.Router();
const userRouter = require("./users");

/* GET home page. */

router.use("/", userRouter);
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
