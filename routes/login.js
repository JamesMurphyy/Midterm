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

  // router.get("/", (req, res) => {
  //   const user = req.session.user;
  //   const templateVars = {
  //     user: user,
  //   };
  //   res.render('login', templateVars);
  // });
  router.get("/", (req, res) => {
    const userId = req.session.userId;
    let errMsg = null;
    const templateVars = { user: userId, errMsg };
    if (!userId) {
      return res.render("login", templateVars);
    }
    res.redirect('/login');
  });

  router.post('/', (req, res) => {

    // access email and pass from within req.body, validate
    let errMsg = '';
    if (email === '' || password === '') {
      return res.status(400).send('Error: need email and password');
      // errMsg = 'Error: Enter Email and Password';
      // const templateVars = { errMsg };
      // return res.render("login", templateVars);
    }
    const { email, password } = req.body;

    // check if cookie is set, if so, redirect, to home page '/'
    // const { userId } = req.session;
    // if (!userId) {
    //   return res.redirect('/login');
    // }

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
        req.session.userId = user.Id;
        return res.redirect('/');
      })
      // .catch((err) => console.log(err.message));
      .catch(err => res.json(err));
  });
  return router;
};
