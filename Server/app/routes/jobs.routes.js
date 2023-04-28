module.exports = app => {

  const auth = require("../middlewares/auth");

  const jobs = require("../controllers/jobs.controller.js");

  var router = require("express").Router();

  router.get("/count", jobs.countJob);
  router.post("/", jobs.createJob);
  router.get("/", jobs.findJobs);
  router.get("/status/:status", jobs.findJobsUsingStatus);

  app.use("/jobs", auth, router);

};