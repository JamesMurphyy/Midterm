DROP TABLE IF EXISTS messages CASCADE;

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
