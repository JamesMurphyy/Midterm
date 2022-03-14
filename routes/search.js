const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const sql = "SELECT * FROM posts WHERE price >= $1 AND price <= $2";
    const params = [((req.query.minPrice)*100), ((req.query.maxPrice)*100)];
    db.query(sql, params)
    .then(data => {
      const user = req.session.userId;
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



