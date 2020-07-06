const mongoose = require('mongoose')
const dataBaseConfig = require('./database/db')

mongoose.Promise = global.Promise;
mongoose.connect(dataBaseConfig.db, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => {
  console.log('Database connected successfully')
}).catch(err => {
  console.log('Could not connected to database:' + err)
})

const app = require('./app')

const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log('Connected to port' + port)
})
