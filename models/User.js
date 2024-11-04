import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserShema = new mongoose.Schema({
  username: {
    type: String,
    minlength: [2, "Username must be at least 2 characters long"],
    maxlength: [20, "Username must be at most 20 characters long"],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters long"],
  },
  email: { type: String, required: true, unique: true },
  token: { type: String, default: null },
});

UserShema.methods.setPassword = async function (password) {
  this.password = await bcrypt.hash(password, 10);
};

UserShema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserShema.methods.setToken = function (token) {
  this.token = token;
};

const User = mongoose.model("User", UserShema);

export default User;
