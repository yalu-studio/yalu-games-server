const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')

const authRoute = express.Router()

authRoute.post('/signup', passport.authenticate('signup', {session: false}), async (req, res, next) => {
  res.json({
    message: 'Signup successful',
    user: req.user
  })
})

authRoute.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err) {
        const error = new Error('An Error occurred: ' + err.message)
        return next(error)
      } else if (!user){
        return next(info)
      }
      req.login(user, {session: false}, async (error) => {
        if (error){
          return next(error)
        }
        const body = {_id: user._id, email: user.email};
        const token = jwt.sign({user: body}, 'top_secret');
        return res.json({user: user, token: token});
      })
    } catch (error) {
      return next(error)
    }
  })(req, res, next)
})

authRoute.get('/test', async (req, res) => {
  res.json({message: 'pass!'})
})

module.exports = authRoute;
