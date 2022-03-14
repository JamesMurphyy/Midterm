const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


module.exports = (db) => {
  router.post("/", (req, res) => {
    req.session = null;
    res.redirect("/");
  });
  return router;
};
