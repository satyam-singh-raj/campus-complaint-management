function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }

  return res.redirect("/login");
}

function ensureRole(role) {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    if (req.session.user.role !== role) {
      return res.status(403).render("error", {
        title: "Access Denied",
        message: "You do not have permission to access this page.",
      });
    }

    return next();
  };
}

module.exports = {
  ensureAuthenticated,
  ensureRole,
};
