import express from 'express';
import customJwtAuth from '../config/middleware/authentication.js';
import { addSubsciberMail, getAllMail, sendMailAllSubscriber } from '../controllers/subscribeConttroler.js';
import requireRoles from '../config/middleware/requireRole.js'
const router = express.Router()

router.post('/addMail/:id',customJwtAuth,addSubsciberMail)
router.get('/getmail',getAllMail)
router.post('/sendmailallsubscriber/:id',customJwtAuth,requireRoles(['admin']),sendMailAllSubscriber)

export default router