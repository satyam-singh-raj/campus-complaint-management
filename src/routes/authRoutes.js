const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }

  return res.render("login", { title: "Login" });
});

router.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }

  return res.render("register", { title: "Register" });
});

router.post("/register", async (req, res) => {
  const { name, username, email, password, role } = req.body;

  if (!name || !username || !email || !password || !role) {
    return res.status(400).render("register", {
      title: "Register",
      error: "All fields are required.",
      formData: { name, username, email, role },
    });
  }

  if (!["student", "admin"].includes(role)) {
    return res.status(400).render("register", {
      title: "Register",
      error: "Invalid role selected.",
      formData: { name, username, email },
    });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).render("register", {
        title: "Register",
        error: "Username or email already exists.",
        formData: { name, username, email, role },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      role,
    });

    return res.redirect("/login");
  } catch (error) {
    return res.status(500).render("register", {
      title: "Register",
      error: "Failed to register user.",
      formData: { name, username, email, role },
    });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).render("login", {
      title: "Login",
      error: "Username and password are required.",
      formData: { username },
    });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).render("login", {
        title: "Login",
        error: "Invalid username or password.",
        formData: { username },
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).render("login", {
        title: "Login",
        error: "Invalid username or password.",
        formData: { username },
      });
    }

    req.session.user = {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      role: user.role,
    };

    return res.redirect("/dashboard");
  } catch (error) {
    return res.status(500).render("login", {
      title: "Login",
      error: "Login failed. Please try again.",
      formData: { username },
    });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
