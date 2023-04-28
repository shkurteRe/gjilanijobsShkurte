module.exports = app => {
  const auth = require("../controllers/auth.controller");
  const authenticated = require("../controllers/authenticated.controller");
  const jobs = require("../controllers/jobs.controller.js");

  var router = require("express").Router();

  router.post("/:document", auth.loginAuth);

  router.post("/verify/:document", auth.verify);

  router.post("/register/:document", auth.createAuth);

  router.post("/access-token/:document", auth.accessToken);

  router.post("/refresh-token/:document", auth.refreshToken);

  router.post("/forgot-password/:document", auth.forgotPassword);

  router.post("/reset-password/:document", auth.resetPassword);

  router.post("/phone/:document", auth.createAuthWithPhone);

  router.post("/phone/verify/:document", auth.createAuthWithPhoneVerify);

  router.post("/google/:document", auth.createAuthWithGoogle);

  router.put("/:document/photo/:user_id", authenticated.updateResume);

  router.get("/:document/files", authenticated.getFilesList);

  router.get("/:document/download/:name", authenticated.download);

  router.get("/download/:name", authenticated.downloadPhoto);

  router.get("/search", jobs.search);

  app.use("/auth", router);
};