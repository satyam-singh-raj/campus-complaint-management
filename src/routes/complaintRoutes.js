const express = require("express");
const Complaint = require("../models/Complaint");
const { ensureAuthenticated, ensureRole } = require("../middleware/auth");

const router = express.Router();

router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  try {
    if (req.session.user.role === "student") {
      const complaints = await Complaint.find({ student: req.session.user.id })
        .sort({ createdAt: -1 })
        .lean();

      return res.render("student-dashboard", {
        title: "Student Dashboard",
        user: req.session.user,
        complaints,
      });
    }

    const complaints = await Complaint.find()
      .populate("student", "name username email")
      .sort({ createdAt: -1 })
      .lean();

    return res.render("admin-dashboard", {
      title: "Admin Dashboard",
      user: req.session.user,
      complaints,
    });
  } catch (error) {
    return res.status(500).render("error", {
      title: "Error",
      message: "Could not load dashboard.",
    });
  }
});

router.get(
  "/complaints/new",
  ensureAuthenticated,
  ensureRole("student"),
  (req, res) => {
    res.render("new-complaint", {
      title: "Add Complaint",
      user: req.session.user,
    });
  }
);

router.post(
  "/complaints",
  ensureAuthenticated,
  ensureRole("student"),
  async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).render("new-complaint", {
        title: "Add Complaint",
        user: req.session.user,
        error: "Title and description are required.",
        formData: { title, description },
      });
    }

    try {
      await Complaint.create({
        title,
        description,
        student: req.session.user.id,
      });

      return res.redirect("/dashboard");
    } catch (error) {
      return res.status(500).render("new-complaint", {
        title: "Add Complaint",
        user: req.session.user,
        error: "Could not submit complaint.",
        formData: { title, description },
      });
    }
  }
);

router.post(
  "/complaints/:id/status",
  ensureAuthenticated,
  ensureRole("admin"),
  async (req, res) => {
    try {
      const { status } = req.body;
      const allowedStatuses = ["Under Investigation", "Resolved"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).render("error", {
          title: "Invalid Status",
          message: "Status update is not allowed.",
        });
      }

      const complaint = await Complaint.findById(req.params.id);

      if (!complaint) {
        return res.status(404).render("error", {
          title: "Not Found",
          message: "Complaint not found.",
        });
      }

      const isValidTransition =
        (complaint.status === "Open" && status === "Under Investigation") ||
        (complaint.status === "Under Investigation" && status === "Resolved");

      if (!isValidTransition) {
        return res.status(400).render("error", {
          title: "Invalid Status",
          message: "Invalid status transition.",
        });
      }

      complaint.status = status;
      await complaint.save();

      return res.redirect("/dashboard");
    } catch (error) {
      return res.status(500).render("error", {
        title: "Error",
        message: "Could not update complaint status.",
      });
    }
  }
);

module.exports = router;
