const express = require('express');
const router  = express.Router();
module.exports = (db) => {
  router.get("/conversations", (req, res) => {
    const sql1 = 'SELECT conversations.*, posts.title, posts.vendor_id FROM conversations JOIN posts ON posts.id = conversations.post_id WHERE from_user = $1';
    const user = [req.session.user.id]
    console.log("current user", user)
    db.query(sql1, user)
    .then(data => {
      const templateVars = { buy_conversations: data.rows, user:user }
      console.log("convos", data.rows)
      const sql2 = 'SELECT conversations.*, posts.title, posts.vendor_id FROM conversations JOIN posts ON posts.id = conversations.post_id WHERE vendor_id = $1';
      const params2 = [req.session.user_id];
      db.query(sql2, params2)
      .then(data => {
        templateVars.sell_conversations = data.rows;
        res.render("conversations", templateVars);
      })
    })
  });
  router.post("/conversations", (req, res) => {
    const sql1 = "INSERT INTO conversations (from_user, post_id) VALUES ($1, $2) RETURNING id";
    const user = [req.session.user_id, req.body.post_id];
    console.log("convo being started by user", user[0], "convo about itemm", user[1])
    db.query(sql1, user)
    .then(data => {
      console.log("conversation id", data.rows[0])
      const conversation_id = data.rows[0].id;
      res.redirect(`/conversations/${conversation_id}`)
    })
  })
  return router;
};
