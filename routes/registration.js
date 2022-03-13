const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {
  router.post('/', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 12);
    const addUser = function (user) {
      const values = [user.name, user.email, user.password];
      return db.query(`INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING *;`, values)
        .then((result) => {
          console.log(result.rows);
          return (result.rows);
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
    console.log(user)
    addUser(user)
    .then(user => {
      if (!user) {
        res.send({error: "error"});
        return;
      }
      req.session.userId = user.id;
      res.send("🤗");
    })
    .catch(e => res.redirect("/"));
  });

  router.get("/", (req, res) => {
    res.render('registration');
  });

  

  return router;
};
