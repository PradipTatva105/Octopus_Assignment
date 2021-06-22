import express from 'express';
import { sendMail, getMail, getAllMail } from '../controllers/mail.controller';

import { 
    CheckValidation, 
    sendMailValidation,
    getMailValidation, getAllMailsValidation
 } from '../utils/mail.validator';

const router = express.Router();

router.post('/sendMail', sendMailValidation, CheckValidation , sendMail);
router.get('/getMail', getMailValidation, CheckValidation , getMail);
router.get('/getAllMails', getAllMailsValidation, CheckValidation ,getAllMail);

export default router;