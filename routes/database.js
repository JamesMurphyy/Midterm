const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});



// exports.addUser = addUser;

// const getUserWithEmail = function (email) {
//   return pool
//     .query(`SELECT * FROM users WHERE email = $1;`, [email])
//     .then((result) => {
//       console.log(result.rows[0]);
//       return result.rows[0];
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// };
// // getUserWithEmail()

// exports.getUserWithEmail = getUserWithEmail;
