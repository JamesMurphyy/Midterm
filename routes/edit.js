const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get(`/:postId`, (req, res) => {
    const postId = req.params.postId;
    const user = req.session.user;

    db.query(
      `
      SELECT * FROM posts
      WHERE vendor_id = $1 AND posts.id = $2;
      `, [user.id, postId])
      .then(data => {
        const templateVars = {
          user: user,
          posts: data.rows,
          postId: postId
        };
        res.render('edit', templateVars);
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post(`/:postId`, (req, res) => {
    const user = req.session.user;
    console.log("IS THIS WORKING");

    const updatePosts = function (posts) {
      const values = [
        user.id,
        posts.title,
        posts.category,
        posts.item_description,
        Number(posts.price),
        posts.photo_url
      ];
      const query =
        `
        UPDATE posts
        SET (vendor_id = $1, title = $2,  category = $3, item_description = $4 , price = $5 , photo_url = $6)
        RETURNING *;
        `;

      return db
        .query(query, values)
        .then((result) => {
          console.log(result.rows);
          return (result.rows);
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
    return updatePosts({ ...req.body, vendor_id: user })
      .then(Posts => {
        res.redirect('/myItems');
      })
      .catch(e => {
        console.error(e);
        res.send(e);
      });
  });
  return router;
};
