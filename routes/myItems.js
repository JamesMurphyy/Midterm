const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.post('/', (req, res) => {
    const userId = req.session.userId;
    const addProperty = function(property) {
      const values = [
        property.title, 
        property.vendor_id,
        property.item_description, 
        Number(property.price), 
        property.photo_url, 
        property.created_at
        property.street, 
        property.country, 
        property.city, 
        property.province, 
        property.post_code
      ];
      const query = `
      INSERT INTO properties (owner_id, title, description, number_of_bedrooms, number_of_bathrooms, parking_spaces, cost_per_night, thumbnail_photo_url, cover_photo_url, street, country, city, province, post_code)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *;`;
    
      return pool.query(query, values)
      .then((result) => {
        console.log(result.rows);
        return (result.rows);
      })
      .catch((err) => {
        console.log(err.message);
      });
    }
    return addProperty({...req.body, owner_id: userId})
      .then(property => {
        res.send(property);
      })
      .catch(e => {
        console.error(e);
        res.send(e)
      });
  });




  router.get("/", (req, res) => {
    const user = req.session.userId;
    const templateVars = {
    user: user,
  };
    res.render('myItems', templateVars);
  });

  

  return router;
};