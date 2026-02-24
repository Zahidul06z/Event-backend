import express from 'express'
import upload from '../media/storyUploads.js';
import { createStory, getStory,deleteStory } from '../controllers/storyConttroler.js';
import customJwtAuth from '../config/middleware/authentication.js';
import requireRoles from '../config/middleware/requireRole.js';
const router = express.Router();


router.post('/createstory/:id',upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]),customJwtAuth,requireRoles(['admin']),createStory)

router.get('/getstory',getStory)
router.delete('/delete/:id',customJwtAuth,requireRoles(['admin']),deleteStory)


export default router