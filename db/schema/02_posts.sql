DROP TABLE IF EXISTS posts CASCADE;

CREATE TABLE posts (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  category_id INTEGER REFERENCES categories(id) NOT NULL,
  vendor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  item_description VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  photo_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  active BOOLEAN NOT NULL DEFAULT TRUE
);
