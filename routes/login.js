const express = require('express');
const { get } = require('express/lib/response');
const router = express.Router();
const bcrypt = require('bcryptjs');
const res = require('express/lib/response');

module.exports = (db) => {

  const getUserWithEmail = function (email) {
    return db
      .query(`SELECT * FROM users WHERE email = $1;`, [email])
      .then((result) => result.rows[0])
      .catch((err) => console.log(err.message));
  };

  // const login = function (email, password) {
  //   return getUserWithEmail(email)
  //     .then(user => {
  //       if (bcrypt.compareSync(password, user.password)) {
  //         return user;
  //       }
  //       return 'null';
  //     })
  //     .catch(err => res.json(err));
  // };

  router.get("/", (req, res) => {
    const user = req.session.userId;
    let errMsg = null;
    const templateVars = { user: user, errMsg };
    if (!user) {
      return res.render("login", templateVars);
    }
    res.redirect('/login');
  });

  router.post('/', (req, res) => {

    // access email and pass from within req.body, validate
    const { email, password } = req.body;
    let errMsg = '';
    if (!email || !password) {
      // return res.status(400).send('Error: need email and password');
      errMsg = 'Error: Enter Email and Password';
      const templateVars = { errMsg };
      return res.render("login", templateVars);
    }

    // check if cookie is set, if so, redirect, to home page '/'
    const { userId } = req.session;
    if (!userId) {
      return res.redirect('/login');
    }

    // check if email exists in database => login
    getUserWithEmail(email)
      .then(user => {
        let templateVars = { user: user, errMsg };
        // if email does NOT exist display error 'emailDOES not Exist'
        if (!user) {
          // return res.status(400).send('Error: email does not EXIST');
          templateVars.errMsg = 'Error: Email does not EXIST';
          res.render("login", templateVars);
        }
        // validate if passwords match
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
          // return res.status(400).send('Error: email does not EXIST');
          templateVars.errMsg = 'Error: Wrong Email or Password';
          res.render("login", templateVars);
        }
        // set cookie for user and redirect to login page
        req.session.userId = userId;
        return res.redirect("/login");
      })
      // .catch((err) => console.log(err.message));
      .catch(err => res.json(err));
  });
  return router;
};


//under post, grab the req.body --> contains username / password
// if user/pass exists, log in

// else return Error

// --------------------------------
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
