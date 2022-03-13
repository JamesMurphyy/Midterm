const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'Midterm'
});



const addUser =  function(user) {
  const values = [user.name, user.email, user.password]
  return pool.query(`INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING *;`, values)
  .then((result) => {
    console.log(result.rows);
    return (result.rows);
  })
  .catch((err) => {
    console.log(err.message);
  });
}
exports.addUser = addUser;

const getUserWithEmail = function(email) {
  return pool
  .query(`SELECT * FROM users WHERE email = $1;`, [email])
  .then((result) => {
    console.log(result.rows[0]);
    return result.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
  });
}
// getUserWithEmail()

exports.getUserWithEmail = getUserWithEmail;