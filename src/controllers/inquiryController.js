const service = require('../services/inquiryService'); const { asyncHandler, ok } = require('../utils/helpers');
exports.create=asyncHandler(async(req,res)=>ok(res,await service.create(req.body),201));
exports.adminList=asyncHandler(async(req,res)=>{const r=await service.adminList(req.query); ok(res,r.items,200,r.meta);});
exports.adminById=asyncHandler(async(req,res)=>ok(res,await service.adminById(req.params.id)));
exports.update=asyncHandler(async(req,res)=>ok(res,await service.update(req.params.id,req.body)));
exports.remove=asyncHandler(async(req,res)=>ok(res,await service.remove(req.params.id)));
