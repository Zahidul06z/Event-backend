import express from 'express'
import customJwtAuth from '../config/middleware/authentication.js'
import requireRoles from '../config/middleware/requireRole.js'
import { commentBlog, createBlog, deleteBlog, getBLog, getSingleBLog } from '../controllers/blogConttroler.js'
import upload from '../media/blogUploads.js'
const router = express.Router()

router.post('/createblog/:id',upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]),customJwtAuth,requireRoles(['admin']),createBlog)

router.get('/getblog',getBLog)
router.get('/getsingleblog/:id',getSingleBLog)
router.delete('/delete/:id',customJwtAuth,requireRoles(['admin']),deleteBlog)
router.post('/comment/:userId/:blogId',customJwtAuth,commentBlog)

export default router