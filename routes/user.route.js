const express = require('express');
const userRoute = express.Router();

userRoute.get('/profile', (req, res, next) => {
  res.json({
    message: 'You made it to the secure route',
    user: req.user,
    token: req.query.secret_token
  })
})

module.exports = userRoute
