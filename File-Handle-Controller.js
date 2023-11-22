const db = require("../../Modules/index"); // models path depend on your structure
const Branch=db.Branch
const multer = require("multer");
const path = require("path");
const { where } = require("sequelize");
const fs=require("fs");
const { log } = require("console");


const storage = multer.diskStorage({
    destination: "Branch_image/",
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const number = Math.random().toString(36).substring(2, 22);
      const newName = number + ext;
      cb(null, newName);
    },
  });
  const upload = multer({ storage }).single("file");

exports.BranchAdd = (req, res) => {
    upload(req, res, function (err) {
        
        if (err) {
          console.error(err);
          res.status(500).send({
            message: "FAILED",
          });
          return;
        }
    
        if (!req.file) {
          res.status(400).send({
            message: "NOTUPLOADED",
          });
          return;
        }
    
        const addimage = {
          image: req.file.filename,
          name:req.body.name,
          branch_type:req.body.branch_type,
          discriptation:req.body.discriptation,
          mobile_no:req.body.mobile_no,
          location:req.body.location,
          city:req.body.city,
          email_id:req.body.email_id
    
        };
    
        {
          Branch.create(addimage)
      .then((data) => {
        res.send("SAVED");
      })
      .catch((err) => {
        res.status(500).send("FAILED");
      });
        }
      });

  };

exports.Branchupdate = (req, res) => {
    const id = req.params.id;
  
    // Retrieve the filename associated with the given ID from your database
    Branch.findOne({ where: { id: id } })
      .then((BranchEntry) => {
        if (!BranchEntry) {
          return res.status(404).send({
            message: "NOTFOUND",
          });
        }
  
        // Delete the old image from the file system
        const filenameToDelete = BranchEntry.image;
        fs.unlink(`Branch_image/${filenameToDelete}`, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send({
              message: "Error deleting the file"
            });
          }
  
          // Now, update the record with new data and image
          upload(req, res, function (err) {
            if (err) {
              console.error(err);
              res.status(500).send({
                message: "FAILED",
              });
              return;
            }
  
            if (!req.file) {
              res.status(400).send({
                message: "NOTUPLOADED",
              });
              return;
            }
  
            const addimage = {
              image: req.file.filename,
              name: req.body.name,
              branch_type: req.body.branch_type,
              discription: req.body.discription,
              mobile_no: req.body.mobile_no,
              location: req.body.location,
              city: req.body.city,
              email_id: req.body.email_id,
            };
  
            // Update the record with new data and image
            Branch.update(addimage, { where: { id: id } })
              .then((num) => {
                if (num == 1) {
                  res.status(200).send({
                    message: "UPDATED",
                  });
                } else {
                  res.status(404).send({
                    message: "NOTFOUND",
                  });
                }
              })
              .catch((err) => {
                res.status(500).send({
                  message: "Error updating Branch record with id=" + id,
                });
              });
          });
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: "Error finding the database record",
        });
      });
  };
  
exports.Branchfind= (req, res) => {

    Branch.findAll()
        .then((data) => {
            res.send(data)
          })
          .catch((err) => {
           console.log(err);
          });
  };

  
exports.Branchdelete = (req, res) => {
    const id = req.params.id;
  
    // Retrieve the filename associated with the given ID from your database
    Branch.findOne({ where: { id: id } })
      .then((BranchEntry) => {
        if (!BranchEntry) {
          return res.status(404).send({
            message: "NOTFOUND",
          });
        }
  
        const filenameToDelete = BranchEntry.image;
  
        // Delete the file from the file system
        fs.unlink(`Branch_image/${filenameToDelete}`, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send({
              message: "Error deleting the file",
            });
          }
  
          // Now, delete the database record
          Branch.destroy({ where: { id: id } })
            .then((num) => {
              if (num == 1) {
                res.status(200).send({
                  message: "DELETED",
                });
              } else {
                res.status(404).send({
                  message: "NOTFOUND",
                });
              }
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send({
                message: "Error deleting the database record",
              });
            });
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: "Error finding the database record",
        });
      });
  };
  ;
