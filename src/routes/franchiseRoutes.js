const express=require('express');
const c=require('../controllers/franchiseController');
const {protect}=require('../middleware/auth');
const {uploadFranchise,fileUrl}=require('../middleware/upload');
const r=express.Router();
const setImg=(req,res,next)=>{ if(req.file) req.body.image=fileUrl('franchise',req.file); next(); };

r.get('/franchise',c.publicList);
r.get('/franchises',c.publicList);
r.get('/franchise/:slug',c.publicBySlug);
r.get('/franchises/:slug',c.publicBySlug);

r.get('/admin/franchise',protect,c.adminList);
r.get('/admin/franchises',protect,c.adminList);
r.get('/admin/franchise/:id',protect,c.adminById);
r.get('/admin/franchises/:id',protect,c.adminById);
r.post('/admin/franchise',protect,uploadFranchise.single('image'),setImg,c.create);
r.post('/admin/franchises',protect,uploadFranchise.single('image'),setImg,c.create);
r.put('/admin/franchise/:id',protect,uploadFranchise.single('image'),setImg,c.update);
r.put('/admin/franchises/:id',protect,uploadFranchise.single('image'),setImg,c.update);
r.delete('/admin/franchise/:id',protect,c.remove);
r.delete('/admin/franchises/:id',protect,c.remove);

module.exports=r;

