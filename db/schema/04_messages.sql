DROP TABLE IF EXISTS messages CASCADE;

CREATE TABLE messages ( -- Each message will have one response
  id SERIAL PRIMARY KEY NOT NULL,
  conversation_id INTEGER REFERENCES conversations(id) NOT NULL,
  from_buyer Boolean NOT NULL DEFAULT TRUE,
  content VARCHAR(255) NOT NULL

);







-- on the UI* IN the inbox page, For every message, have a toggle <div> and query the response attribute for the particular message_id

  -- WHEN THE BUYER tries to contact the seller, have a pre-written message " I'm interested in this item. Please provide a contact~"

  --it's assumed that the seller will provide a number or an email in the response. ELSE, error.

  --IF EMPTY, provide textbox to add response.
  --ELSE , show response.

/*
seller POV on inbox

query inbox  --> joined tables --> messages + posts --> based on vendor_id --> query the messages.

*/
