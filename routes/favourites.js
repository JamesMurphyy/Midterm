const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    const sqlQuery = "SELECT * FROM favourites JOIN posts ON post_id = posts.id WHERE favourites.user_id = $1;";
    db.query(sqlQuery, [req.session.user.id])
    .then(data => {
      const user = req.session.user
      const templateVars = { posts: data.rows,
      user: user }
      res.render("favourites", templateVars);
    })
  });

  router.post("/:post_id", (req, res) => {
    const post_id = req.params.post_id;
    const userID = req.session.user.id;
    console.log(post_id, userID);

    const sqlQuery = "SELECT * FROM favourites WHERE user_id = $1 and post_id = $2;";
    db.query(sqlQuery, [userID, post_id])
    .then(data => {
      console.log("Data.rows:", data.rows);
     if (data.rows && data.rows.length){
       res.redirect("/favourites");

     }else {
      const sql = `INSERT INTO favourites (user_id, post_id) VALUES ($1, $2) RETURNING *;`
      db.query(sql, [userID, post_id])
      .then(data => {


        res.redirect("/favourites");
      });
     }
    })
  });


  // router.post('/:postId/delete' , (req, res) => {
  //   console.log("In delete function")
  //   console.log(req.params)
  //   const favouritesPostId = req.params
  //   const query = `DELETE FROM favourites WHERE favourites.post_id = $1 RETURNING *;`
  //     return db
  //     .query(query, [favouritesPostId])
  //     .then((result) => {
  //       console.log("delete post", result.rows[0]);
  //       res.redirect('/favourites')
  //     })
  // })



  router.post("/:post_id/delete", (req, res) => {
    console.log("INSIDE FAVOURITES DELETE ==============")
    const post_id = req.params.post_id;
    const userID = req.session.user.id;
    console.log(post_id, userID)
    const sql = `DELETE FROM favourites WHERE user_id = $1 AND post_id = $2 RETURNING *;`
    db.query(sql, [userID, post_id])
    .then(data => {
      res.redirect("/favourites")
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  });
  return router;
};
