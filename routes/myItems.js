const express = require('express');
const router = express.Router();

module.exports = (db) => {

  router.post('/', (req, res) => {
    const user = req.session.user;
    const addPosts = function (posts) {
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
        INSERT INTO posts (vendor_id, title,  category, item_description, price, photo_url )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
        `;
      return db
        .query(query, values)
        .then((result) => {
          // console.log(result.rows);
          return (result.rows);
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
    return addPosts({ ...req.body, vendor_id: user })
      .then(posts => {
        res.redirect('/myItems');
      })
      .catch(e => {
        console.error(e);
        res.send(e);
      });
  });

  const sqlQuery = `SELECT * FROM posts WHERE vendor_id = $1 ORDER BY created_at DESC;`;
  router.get("/", (req, res) => {
    const user = req.session.user;
    db
      .query(sqlQuery, [user.id])
      .then(data => {
        const user = req.session.user;
        const templateVars = {
          user: user,
          posts: data.rows
        };
        res.render("myItems", templateVars);
      });

  });

  router.post('/:postId/edit', (req, res) => {
    const postId = req.params.postId;
    const user = req.session.user;
    const query = `SELECT * FROM posts WHERE vendor_id = $1 AND posts.id = $2 ORDER BY created_at DESC;`;
    return db
      .query(query, [user.id, postId])
      .then((result) => {
        // console.log("edit post", result.rows[0]);
        res.redirect(`/edit/${postId}`);
      });
  });
  router.post('/:postId/sold', (req, res) => {
    const postId = req.params.postId;
    const user = req.session.user;
    const query = `UPDATE posts SET active = false WHERE posts.id = $1 RETURNING *;`;
    return db
      .query(query, [postId])
      .then((result) => {
        // console.log("update post", result.rows);
        res.redirect(`/myItems`);
      });
  });

  router.post('/:postId/delete', (req, res) => {
    console.log("In delete function");
    const postId = req.params.postId;
    const query = `DELETE FROM posts WHERE posts.id = $1 RETURNING *;`;
    return db
      .query(query, [postId])
      .then((result) => {
        // console.log("delete post", result.rows[0]);
        res.redirect('/myItems');
      });
  });
  return router;
};
