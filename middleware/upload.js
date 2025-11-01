const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const safeName = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
    cb(null, safeName);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.pdf' || file.mimetype !== 'application/pdf') {
    return cb(new Error('Seuls les PDF sont acceptés'));
  }
  cb(null, true);
};

exports.uploadPdf = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }).single('spec');
