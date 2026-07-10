const mongoose = require('mongoose');
const createDynamicModel = require('./dynamicModel');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

let MongooseUser;
try {
  MongooseUser = mongoose.model('User', userSchema);
} catch (e) {
  MongooseUser = mongoose.model('User');
}

module.exports = createDynamicModel('User', MongooseUser, 'users');
