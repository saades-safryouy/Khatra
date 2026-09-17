const service = require('../services/productService'); const { asyncHandler, ok } = require('../utils/helpers'); const { fileUrl } = require('../middleware/upload');
const urls = req => (req.files || []).map(f => fileUrl('products', f));
exports.publicList=asyncHandler(async(req,res)=>{const r=await service.publicList(req.query); ok(res,r.items,200,r.meta);});
exports.publicBySlug=asyncHandler(async(req,res)=>ok(res,await service.publicBySlug(req.params.slug)));
exports.adminList=asyncHandler(async(req,res)=>{const r=await service.adminList(req.query); ok(res,r.items,200,r.meta);});
exports.adminById=asyncHandler(async(req,res)=>ok(res,await service.adminById(req.params.id)));
exports.create=asyncHandler(async(req,res)=>ok(res,await service.create(req.body,urls(req)),201));
exports.update=asyncHandler(async(req,res)=>ok(res,await service.update(req.params.id,req.body,urls(req))));
exports.remove=asyncHandler(async(req,res)=>ok(res,await service.remove(req.params.id)));
