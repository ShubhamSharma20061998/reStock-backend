const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `../../assets/${req.user.id}`);
  },
  filename: function (req, file, cb) {
    const uploadName = `${Date.now()} - ${req.originalname})`;
    cb(null, uploadName);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
