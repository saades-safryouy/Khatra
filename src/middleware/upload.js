const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { AppError } = require('../utils/helpers');
const allowed = ['image/jpeg','image/png','image/webp','image/gif'];
const dirs = { products: 'products', categories: 'categories', stores: 'stores', franchise: 'franchise' };
function makeUploader(type) {
  const sub = dirs[type]; if (!sub) throw new Error('Invalid upload type');
  const dest = path.join(__dirname, '..', '..', 'uploads', sub); fs.mkdirSync(dest, { recursive: true });
  const storage = multer.diskStorage({ destination: (req,file,cb)=>cb(null,dest), filename: (req,file,cb)=>cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname).toLowerCase()}`) });
  return multer({ storage, limits: { fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB || '5',10))*1024*1024 }, fileFilter: (req,file,cb)=> allowed.includes(file.mimetype) ? cb(null,true) : cb(new AppError('Invalid file type. Only images are allowed.',400)) });
}
const fileUrl = (type, file) => file ? `/uploads/${dirs[type]}/${file.filename}` : null;
function deleteFile(url) { if (!url || !url.startsWith('/uploads/')) return; const full = path.join(__dirname, '..', '..', url); fs.unlink(full, () => {}); }
module.exports = { uploadProduct: makeUploader('products'), uploadCategory: makeUploader('categories'), uploadStore: makeUploader('stores'), uploadFranchise: makeUploader('franchise'), fileUrl, deleteFile };
