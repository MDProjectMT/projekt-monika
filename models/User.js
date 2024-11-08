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

//UserSchema to schemat modelu Mongoose używany do reprezentowania struktury dokumentu użytkownika w bazie danych MongoDB. Schemat definiuje pola i metody, które można stosować na obiektach użytkownika.

// UserSchema.methods to sposób na dodanie niestandardowych metod do obiektów, które będą tworzone na podstawie tego schematu. W ten sposób każda instancja modelu użytkownika (np. const user = new User()) będzie miała dostęp do tych metod.

//methods to obiekt w schemacie Mongoose, do którego można dodawać metody instancji (czyli metody, które można wywołać na poszczególnych instancjach modelu, takich jak user).

//bcrypt.compare() sprawdza, czy hasło podane przez użytkownika, po przejściu przez proces haszowania, pasuje do hasha przechowywanego w bazie danych. zwraca BOOLEN
