import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const userScheme = new Schema(
  {
    login: { type: String },
    password: { type: String },
    email: { type: String },
    fullName: { type: String },
    role: { type: String },
    signUpDate: {
      type: Date,
      default: Date.now()
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { versionKey: false }
);

userScheme.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userScheme.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

export const User = mongoose.model('User', userScheme);
