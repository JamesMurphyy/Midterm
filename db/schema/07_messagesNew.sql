DROP TABLE IF EXISTS messages CASCADE;

CREATE TABLE messages (
id SERIAL PRIMARY KEY NOT NULL,
buyer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
message TEXT
);
