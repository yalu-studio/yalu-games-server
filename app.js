const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')

const User = require('./models/user')
require('./auth/auth')
const gameRoute = require('./routes/game.route')
const userRoute = require('./routes/user.route')
const authRoute = require('./routes/auth.route')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cors())

app.use(express.static(path.join(__dirname, 'dist/gamelib')))

app.use('/api', gameRoute)
app.use('/', authRoute)
app.use('/user', passport.authenticate('jwt', {session: false}), userRoute)

// app.use((req, res, next) => {
//   next(createError(404))
// })

app.get('/', (req, res) => {
  res.send('invalid endpoint')
})

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist/gamelib/index.html'))
// })

app.use((err, req, res, next) =>{
  console.error(err.message)
  if(!err.statusCode){
    err.statusCode = 500
  }
  res.status(err.statusCode).send({message: err.message})
})

module.exports = app;
