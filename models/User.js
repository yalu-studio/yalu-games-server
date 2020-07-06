const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email:{
    type: String,
    required: true,
    unique: true
  },
  password : {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  userNum: {
    type: Number,
    default: 0,
    unique: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActiveAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
})

UserSchema.pre('save', async function(next) {
  const user = this;
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

UserSchema.methods.isValidPassword = async function(password) {
  const user = this;
  const result = await bcrypt.compare(password, user.password);
  return result;
}

const User = mongoose.model('user', UserSchema)
module.exports = User
