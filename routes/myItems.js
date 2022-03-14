const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.post('/', (req, res) => {
    const user = req.session.user;
    console.log(req.session.user, "llllllllllll")
    const addPosts = function(posts) {
      const values = [
        user.id,
        posts.title, 
        posts.category,
        posts.item_description, 
        Number(posts.price), 
        posts.photo_url 
      ];
      console.log(values)
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
    }
    return addPosts({...req.body, vendor_id: user})
      .then(Posts => {
        res.send(Posts);
      })
      .catch(e => {
        console.error(e);
        res.send(e)
      });
  });




  router.get("/", (req, res) => {
    const user = req.session.user;
    const templateVars = {
    user: user,
  };
    res.render('myItems', templateVars);
  });

  

  return router;
};