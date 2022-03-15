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



const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  if (!options.city && !options.owner_id && !options.minimum_price_per_night && !options.maximum_price_per_night && !options.minimum_rating) {

    queryParams.push(limit);
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;

  } else {
    queryParams.push(limit);
    queryString += `WHERE true `;

    if (options.city) {
      queryParams.push(`%${options.city}%`);
      queryString += `AND city LIKE $${queryParams.length} `;
    }

    if (options.minimum_price_per_night) {
      queryParams.push(options.minimum_price_per_night * 100);
      queryString += `AND cost_per_night > $${queryParams.length} `;
    }
    if (options.maximum_price_per_night) {
      queryParams.push(options.maximum_price_per_night * 100);
      queryString += ` AND cost_per_night < $${queryParams.length} `;
    }
    if (options.owner_id) {
      queryParams.push(options.owner_id);
      queryString += `AND owner_id = $${queryParams.length} `;
    }

    queryString += ` GROUP BY properties.id `;

    if (options.minimum_rating) {
      queryParams.push(options.minimum_rating);
      queryString += ` HAVING AVG(property_reviews.rating) >= $${queryParams.length} `;
    }

    queryString += `ORDER BY cost_per_night LIMIT $1;`;

  }
  // 5
  console.log(queryString, queryParams);
  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
};

exports.getAllProperties = getAllProperties;
