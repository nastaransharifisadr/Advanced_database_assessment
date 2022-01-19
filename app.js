require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const Users = require("./models/Users");
const {
  WEB_PORT
} = process.env;

const usersCon = require("./controllers/Users");
const servicesCon = require("./controllers/services");
const bookingsCon = require("./controllers/bookings");



const app = express();
app.set("view engine", "ejs");

/**
 * notice above we are using dotenv. We can now pull the values from our environment
 */

const { PORT, MONGODB_URI } = process.env;

/**
 * connect to database
 */




mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});

/***
 * We are applying our middlewear
 */
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressSession({ 
  secret: 'foo barr', 
  cookie: { expires: new Date(253402300000000) },
}))


const authMiddleware = async (req, res, next) => {
  const user = await Users.findById(req.session.userID);
  if (!user) {
    return res.redirect('/');
  }
  next()
}


app.get("/",servicesCon.list);
/*creating path for services*/
app.get("/create-services", authMiddleware, (req, res) => {
res.render("create-services", { errors: {} });
});
app.post("/create-services", servicesCon.create);
app.get("/services", servicesCon.list);
app.get("/services/delete/:id", servicesCon.delete);
app.get("/services/update/:id", servicesCon.edit);
app.post("/services/update/:id", servicesCon.update);



/*creating path for bookings*/

app.get("/create-bookings", authMiddleware, (req, res) => {
res.render("create-bookings", { errors: {} });
});

app.post("/create-bookings", bookingsCon.create);

app.get("/bookings", bookingsCon.list);
app.get("/bookings/delete/:id", bookingsCon.delete);
app.get("/bookings/update/:id", bookingsCon.edit);
app.post("/bookings/update/:id", bookingsCon.update);


/*creating path for users*/


app.get("/join", (req, res) => {
  res.render('create-user', { errors: {} })
});

app.post("/join", usersCon.create);
app.get("/login", (req, res) => {
  res.render('login-user', { errors: {} })
});
app.post("/login", usersCon.login);

app.listen(WEB_PORT, () => {
console.log(
    `Example app listening at http://localhost:${WEB_PORT}`,
    chalk.green("✓")
);
});

    

