/* eslint-disable space-before-function-paren */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

module.exports = (db) => {

  const addUser = function (user) {
    const values = [user.name, user.email, user.password];
    return db.query(`INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING *;`, values)
      .then((result) => {
        console.log("lol:", result.rows[0]);
        return (result.rows[0]);
      })
      .catch((err) => {
        console.log("error:", err.message);
      });
  };

  router.post('/', (req, res) => { // need to destructure the data --> name email pass FROM req.body (refer to line 55 -- login.js)

    // if (email === '' || password === '') {
    //   return res.status(400).send("Email or password field is blank");
    // }
    //   const { name, email, password } = req.body;
    //   const user = { name, email, password };
    //   const salt = bcrypt.genSaltSync(12);
    //   user.password = bcrypt.hashSync(user.password, salt);

    //   // addUser(user)
    //   //   .then(returnedUser => {

    //   //   });

    //   console.log(user);
    //   return addUser(user)
    //     .then(returnedUser => { //refers to line 8
    //       if (!returnedUser) {
    //         res.send({ error: "error" });
    //         return;
    //       }
    //       req.session.userId = ({ user: { name: user.name, email: user.email, id: user.id } });

    //       console.log("wkwkwkwk", returnedUser);
    //       res.redirect("/");

    //     })
    //     .catch(e => {
    //       console.log(e);
    //       return res.send(e);
    //     });
    // });

    // router.get("/", (req, res) => {
    //   const user = req.session.userId;
    //   let errMsg = null;
    //   const templateVars = { user: user, errMsg };
    //   if (!user) {
    //     return res.render(`registration`, templateVars);
    //   }
    const { name, email, password } = req.body;
    const user = { name, email, password };
    user.password = bcrypt.hashSync(user.password, 12);


    console.log(user);
    return addUser(user)
      .then(returnedUser => { //refers to line 8
        if (!returnedUser) {
          res.send({ error: "error" });
          return;
        }
        req.session.user = ({ name: user.name, email: user.email, id: returnedUser.id });

        console.log("wkwkwkwk", returnedUser);
        console.log("llllllllllllllll", req.session);
        res.redirect("/");

      })
      .catch(e => {
        console.log(e);
        res.send(e);
      });
  });

  router.get("/", (req, res) => {
    const user = req.session.user;
    const templateVars = {
      user: user,
    };
    res.render('registration', templateVars);
  });
  return router;
};


// app.post("/register", (req, res) => {
//   // checks to see if password or email are empty
//   if (req.body["email"] === '' || req.body["password"] === '') {
//     return res.status(400).send("Email or password field is blank");
//   }
//   const email = req.body["email"];
//   const password = req.body["password"];
//   const user = getUserByEmail(email, urlDatabase);
//   // creates salt and hashes for passwords
//   const salt = bcrypt.genSaltSync();
//   const hashedPassword = bcrypt.hashSync(password, salt);
//   if (!user) {
//     const userRandomId = generateRandomString();
//     insertUser(userRandomId, email, hashedPassword);
//     req.session["user_id"] = userRandomId;
//     return res.redirect("/urls");
//   }
//   return res.status(400).send('Error: Email exits');
// });
