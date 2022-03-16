const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {
    console.log(req.body);
    const sql = "SELECT * FROM posts WHERE price >= $1 AND price <= $2";
    const params = [((req.body.minPrice)), ((req.body.maxPrice))];
    db.query(sql, params)
    .then(data => {
      const user = req.session.user;
      const templateVars = {
         posts: data.rows,
         user: user
         }
      console.log("search results", templateVars.posts)
      res.render("search", templateVars);
    })
  });
  return router;
};

