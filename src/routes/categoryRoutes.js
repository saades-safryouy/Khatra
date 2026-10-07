const express=require('express');
const c=require('../controllers/categoryController'); 
const {protect}=require('../middleware/auth'); 
const {uploadCategory,fileUrl,deleteFile}=require('../middleware/upload'); 
const r=express.Router(); 
const setImg=(req,res,next)=>{ 
    if(req.file) 
        req.body.image=fileUrl('categories',req.file); 
    next(); 
    }; 
    r.get('/categories',c.publicList); 
    r.get('/categories/:slug',c.publicBySlug); 
    r.get('/admin/categories',protect,c.adminList); 
    r.post('/admin/categories',protect,uploadCategory.single('image'),setImg,c.create); 
    r.get('/admin/categories/:id',protect,c.adminById); 
    r.put('/admin/categories/:id',protect,uploadCategory.single('image'),setImg,c.update); 
    r.delete('/admin/categories/:id',protect,c.remove); module.exports=r;
