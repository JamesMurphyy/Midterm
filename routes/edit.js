const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const postId = req.params.postId
    const user = req.session.user;
    db.query(`SELECT * FROM posts WHERE vendor_id = $1 AND posts.id = $2`, [user.id, postId])
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });



  return router;
};
