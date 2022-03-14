const express = require('express');
const { get } = require('express/lib/response');
const router  = express.Router();
const bcrypt = require('bcrypt');
const users = require('./users');

// module.exports = (db) => {
//   router.post("/", (req, res) => {
//     console.log(req.body)
//     db.query(`SELECT * FROM users;`)
//       .then(data => {
//         const users = data.rows;
//         res.json({ users });
//       })
//       .catch(err => {
//         res
//           .status(500)
//           .json({ error: err.message });
//       });
//   });
//   router.get("/", (req, res) => {
//     res.render('login');
//   });
//   return router;
// };




module.exports = (db) => {

  const getUserWithEmail = function(email) {
    return db
    .query(`SELECT * FROM users WHERE email = $1;`, [email])
    .then((result) => {
      console.log("test:", result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
  }

  const login =  function(email, password) {

    return getUserWithEmail(email)
    .then(user => {

      if (bcrypt.compareSync(password, user.password)) {
        console.log("user:", user);
        return user;
      }
      return null;
    });
  }
  router.post('/', (req, res) => {
    const {email, password} = req.body;
    return login(email, password)

    .then(user => {
      console.log(user)
      if (!user) {
        res.status(401).send(`<html><body>Sorry! Please <a href="/login">login</a> or <a href="/register">register</a> to access this page.</body></html>\n`);
        return;
      }
      console.log("logging user", user);
      req.session.user = ({name: user.name, email: user.email, id: user.id});
      res.redirect('/')
      // res.send({user: {name: user.name, email: user.email, id: user.id}})
    })
    .catch(e => {
      console.log(e)
      res.status(401).send(`<html><body>Sorry! Please <a href="/login">login</a> or <a href="/register">register</a> to access this page.</body></html>\n`);
    });
  });

  router.get("/", (req, res) => {
    const user = req.session.user;
    const templateVars = {
    user: user,
  };
    res.render('login', templateVars);
  });

  return router;
};


//under post, grab the req.body --> contains username / password
// if user/pass exists, log in
// else return Error
