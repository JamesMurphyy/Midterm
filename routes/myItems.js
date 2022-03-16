const express = require('express');
const router = express.Router();

module.exports = (db) => {

  router.post('/', (req, res) => {
    const user = req.session.user;
    console.log(req.session.user, "llllllllllll");
    const addPosts = function (posts) {
      const values = [
        user.id,
        posts.title,
        posts.category,
        posts.item_description,
        Number(posts.price),
        posts.photo_url
      ];
      // if (values.id === '' && values.title === '' && values.category === '' && values.item_description === '' && values.price === '' && !values.photo_url === '') {
      const query = `
        INSERT INTO posts (vendor_id, title,  category, item_description, price, photo_url )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;`;

      return db
        .query(query, values)
        .then((result) => {
          console.log(result.rows);
          return (result.rows);
        })
        .catch((err) => {
          console.log(err.message);
        });
      // } else {
      //   res.status(401).send(`<html><body>Sorry! Please <a href="/myItems">try again.</a>All of the fields must be filled out to add a post.</body></html>\n`);
      // }

    };
    return addPosts({ ...req.body, vendor_id: user })
      .then(Posts => {
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


  // router.post('/:postId/delete' , (req, res) => {
  //   const postId = req.params.postId
  //   const user = req.session.user;
  //   console.log("ppppppppppppppppppppppppppppppppp", user)
  //   console.log("ppppppppppppppppppppppppppppppppp", postId)

  //   const query = `SELECT * FROM posts WHERE vendor_id = $1 ORDER BY created_at DESC;`
  //       return db
  //       .query(query, [user.id])
  //       .then((result) => {
  //         for (const row of result.rows) {
  //           console.log("test:", row.id)
  //           console.log("test2", Number(postId))
  //           if (row.id === Number(postId)) {
  //             console.log(row, "testsssss")
  //             delete row
  //             res.redirect('/myItems')
  //           }
  //         }
  //       })
  // delete post[postId]
  // })

  router.post('/:postId/edit', (req, res) => {
    const postId = req.params.postId;
    const user = req.session.user;
    const query = `SELECT * FROM posts WHERE vendor_id = $1 AND posts.id = $2 ORDER BY created_at DESC;`;
    return db
      .query(query, [user.id, postId])
      .then((result) => {
        console.log("edit post", result.rows[0]);
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
        console.log("update post", result.rows);
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
        console.log("delete post", result.rows[0]);
        res.redirect('/myItems');
      });
  });
  return router;
};
