const multer = require('multer');
const path = require('path');
const fs = require('fs');

const imageDir = path.join(__dirname, '../../public/images');
if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, imageDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) { 
        cb(null, true);
    } else {
        cb(new Error('Only images (jpg, jpeg, png) are allowed'));
    } 
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});

module.exports = upload;
