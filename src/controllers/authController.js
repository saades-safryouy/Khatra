const jwt = require('jsonwebtoken'); const bcrypt = require('bcryptjs'); const prisma = require('../config/database'); const { asyncHandler, ok, AppError } = require('../utils/helpers');
const select = { id:true, firstName:true, lastName:true, email:true, role:true, active:true, createdAt:true, updatedAt:true };
exports.login = asyncHandler(async (req,res)=>{ const { email, password } = req.body; if(!email||!password) throw new AppError('Email and password are required',400); const user=await prisma.user.findUnique({where:{email}}); if(!user||!user.active||!(await bcrypt.compare(password,user.password))) throw new AppError('Invalid credentials',401); const token=jwt.sign({id:user.id,role:user.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||'7d'}); const {password:_,...safe}=user; ok(res,{user:safe,token}); });
exports.logout = asyncHandler(async (req,res)=>ok(res,{message:'Logged out'}));
exports.me = asyncHandler(async (req,res)=>ok(res,req.user));
