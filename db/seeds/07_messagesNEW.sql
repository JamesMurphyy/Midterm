
/* Adding fake data to the messages table. */
INSERT INTO messages(id, buyer_id, post_id, message)
VALUES (4, 5, 126, 'Hello is the car still available?'),
(6, 7, 125, 'Are you the only owner?');
--ALTER SEQUENCE messages_id_seq RESTART WITH 3;
