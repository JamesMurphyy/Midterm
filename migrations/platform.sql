DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS favourites CASCADE;
DROP TABLE IF EXISTS messages CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY NOT NULL,
  vendor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

  title VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  photo_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  city VARCHAR(255) NOT NULL,

  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE favourites (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
);

CREATE TABLE messages ( -- Each message will have one response
  id SERIAL PRIMARY KEY NOT NULL,
  buyer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  message TEXT,
  sent_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  response INTEGER REFERENCES messages ON DELETE CASCADE
  -- on the UI* IN the inbox page, For every message, have a toggle <div> and query the response attribute for the particular message_id

  -- WHEN THE BUYER tries to contact the seller, have a pre-written message " I'm interested in this item. Please provide a contact~"

  --it's assumed that the seller will provide a number or an email in the response. ELSE, error.

  --IF EMPTY, provide textbox to add response.
  --ELSE , show response.
);



/*
seller POV on inbox

query inbox  --> joined tables --> messages + posts --> based on vendor_id --> query the messages.

*/
