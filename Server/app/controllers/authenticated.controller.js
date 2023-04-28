var fs = require("fs");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = require("../models");
const uploadFile = require("../middlewares/upload");
const users_ = require("../middlewares/users");

exports.updateProfile = async (req, res) => {
  try {
    const id = req.user.id;

    const user = await db[req.params.document].findById(id);

    if (!user) {
      res.status(404).send({
        message: "No user found.",
      });
    } else {
      if (user.login_method == "Google" || user.login_method == "Apple") {
        delete req.body.email;
      }

      if (user.login_method != "Email") {
        delete req.body.is_2factor_auth_enabled;
      }

      if (user.login_method == "Phone") {
        delete req.body.phone;
      }

      delete req.body.password;

      db[req.params.document]
        .findByIdAndUpdate(id, req.body, {
          useFindAndModify: false,
          runValidators: true,
        })
        .then(async (data) => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update with id=${id}`,
            });
          } else {
            const user = await db[req.params.document].findById(id);

            res.send({
              user: user,
            });
          }
        })
        .catch((error) => {
          var message = error.message;
          if (error.code == 11000) {
            message = "Email already exist.";
          }
          res.status(500).send({
            message: message || "Error updating with id=" + id,
          });
        });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const id = req.user.id;

    const user = await db[req.params.document].findById(id);

    if (!user) {
      res.status(404).send({
        message: "No user found.",
      });
    } else {
      const match = await bcrypt.compare(req.body.old_password, user.password);
      if (match) {
        bcrypt.hash(
          req.body.password,
          saltRounds,
          async function (error, hash) {
            db[req.params.document]
              .findByIdAndUpdate(
                id,
                {
                  password: hash,
                },
                {
                  useFindAndModify: false,
                  runValidators: true,
                }
              )
              .then((data) => {
                if (!data) {
                  res.status(404).send({
                    message: `Cannot update with id=${id}`,
                  });
                } else {
                  res.send(data);
                }
              })
              .catch((error) => {
                res.status(500).send({
                  message: error.message || "Error updating with id=" + id,
                });
              });
          }
        );
      } else {
        res.status(400).send({
          message: `Incorrect old password.`,
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.updateProfilePhoto = async (req, res) => {
  try {
    if (!fs.existsSync(__basedir + "/app/storage/users/")) {
      fs.mkdirSync(__basedir + "/app/storage/users/");
    }
    
    const user = await db["users"].findById(req.user.id);

    if (fs.existsSync(__basedir + "/app/storage/users/" + user.photo)) {
      fs.unlinkSync(__basedir + "/app/storage/users/" + user.photo);
    }

    await users_(req, res);

    if (req.file == undefined) {
      return res.status(400).send({
        message: "Please upload a file!",
      });
    }

    await db["users"].findByIdAndUpdate(
      req.user.id,
      {
        photo: req.title,
      },
      {
        useFindAndModify: false,
        runValidators: true,
      }
    );

    res.status(200).send({
      message: "Uploaded the file successfully",
      file: req.title,
    });
  } catch (error) {
    if (error.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${error}`,
    });
  }
};

exports.updateResume = async (req, res) => {
  try {
    if (!fs.existsSync(__basedir + "/app/storage/resume/")) {
      fs.mkdirSync(__basedir + "/app/storage/resume/");
    }
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({
        message: "Please upload a file!",
      });
    }

    await db["users"].findByIdAndUpdate(
      req.params.user_id,
      {
        resume: req.title,
      },
      {
        useFindAndModify: false,
        runValidators: true,
      }
    );

    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
      file: req.title,
    });
  } catch (error) {
    if (error.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${error}`,
    });
  }
};

exports.getFilesList = async (req, res) => {
  const directoryPath = __basedir + "/app/storage/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

exports.download = async (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/app/storage/resume/";

  res.download(directoryPath + fileName, fileName, (error) => {
    if (error) {
      res.status(500).send({
        message: "Could not download the file. " + error,
      });
    }
  });
};

exports.downloadPhoto = async (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/app/storage/users/";

  res.download(directoryPath + fileName, fileName, (error) => {
    if (error) {
      res.status(500).send({
        message: "Could not download the file. " + error,
      });
    }
  });
};
