require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const { engine } = require("express-handlebars");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

const app = express();
const port = process.env.PORT || 3000;
const mongoUri =
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/campus_complaint_management";

connectDB(mongoUri);

app.engine(
  "handlebars",
  engine({
    helpers: {
      eq: (a, b) => a === b,
      formatDate: (dateValue) => {
        const date = new Date(dateValue);
        return date.toLocaleString();
      },
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "local-dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

app.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }

  return res.redirect("/login");
});

app.use(authRoutes);
app.use(complaintRoutes);

app.use((req, res) => {
  res.status(404).render("error", {
    title: "Not Found",
    message: "Page not found.",
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
