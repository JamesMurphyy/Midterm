const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {
  const addUser = function (user) {
    const values = [user.name, user.email, user.password];
    return db.query(`INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING *;`, values)
      .then((result) => {
        console.log(result.rows);
        return (result.rows[0]);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  router.post('/', (req, res) => { // need to destructure the data --> name email pass FROM req.body (refer to line 55 -- login.js)
    const {name, email, password} = req.body;
    const user = {name, email, password};
    user.password = bcrypt.hashSync(user.password, 12);


    console.log(user)
    return addUser(user)
    .then(returnedUser => { //refers to line 8
      if (!returnedUser) {
        res.send({error: "error"});
        return;
      }
      req.session.userId = ({user: {name: user.name, email: user.email, id: user.id}});

      console.log("wkwkwkwk", returnedUser)
      res.redirect("/")

    })
    .catch(e => {
      console.log(e)
      res.send(e)
    });
  });

  router.get("/", (req, res) => {
    const user = req.session.userId;
    const templateVars = {
    user: user,
  };
    res.render('registration', templateVars);
  });
  return router;
};