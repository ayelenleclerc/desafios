const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const UserDao = require("../models/daos/Users.dao");
const { formatUserForDB } = require("../utils/users.utils");

const User = new UserDao();

const salt = () => bcrypt.genSaltSync(10);
const createHash = (password) => bcrypt.hashSync(password, salt());
const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);
// Passport  Local Strategy

//Sing up
passport.use(
  "signup",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const userItem = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          birthdate: req.body.birthdate,
          email: username,
          password: createHash(password),
        };
        console.log(userItem);
        const newUser = formatUserForDB(userItem);
        const user = await User.createUser(newUser);
        console.log("User registration successful");
        return done(null, user);
      } catch (error) {
        console.log("Error singing user up...");
        return done(error);
      }
    }
  )
);

// Sign in

passport.use(
  "signin",
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.getByEmail(username);
      if (!isValidPassword(user, password)) {
        console.log("Invalid User or Password");
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      console.log("Error signing in...");
      return done(error);
    }
  })
);

//serialization
passport.serializeUser((user, done) => {
  console.log("Inside serializer");
  done(null, user._id);
});

//deserialization

passport.deserializeUser(async (id, done) => {
  console.log("Inside DEserializer");
  const user = await User.getById(id);
  done(null, user);
});

module.exports = passport;
