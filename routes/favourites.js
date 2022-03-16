const express = require('express');
const router = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    const sqlQuery = "SELECT * FROM favourites JOIN posts ON post_id = posts.id WHERE favourites.user_id = $1;";
    db.query(sqlQuery, [req.session.user.id])
      .then(data => {
        const user = req.session.user;
        const templateVars = {
          posts: data.rows,
          user: user
        };
        res.render("favourites", templateVars);
      });
  });

  router.post("/:post_id", (req, res) => {
    const post_id = req.params.post_id;
    console.log(req.params);
    console.log(req.session);

    const userID = req.session.user.id;

    console.log("userID", userID);
    console.log("req.params", req.params);
    const sql = `INSERT INTO favourites (user_id, post_id) VALUES ($1, $2) RETURNING *;`;
    db.query(sql, [userID, post_id])
      .then(data => {
        console.log("fbasdljfbndlskjfndaslkjfnads");
        console.log(data);
        res.redirect("/favourites");
      });
  });
  return router;
};
