const express = require("express");
const morgan = require("morgan");
const { environment } = require('../config');
const router = express.Router()


router.get("/", (req, res) => {

  res.json({
    message: "test root index"
  });
});



module.exports = router
