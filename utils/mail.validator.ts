import { Response, Request, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';

export const sendMailValidation = [
    check('username').not().isEmpty().withMessage("Username is required!"),
    check('recipients').not().isEmpty().withMessage("Recipients is required!"),
    check('message').not().isEmpty().withMessage("Message is required!")
];

export const getMailValidation = [
  check('username').not().isEmpty().withMessage("Username is required!"),
  check('mail_id').not().isEmpty().withMessage("MailId is required!")
];


export const getAllMailsValidation = [
  check('username').not().isEmpty().withMessage("Username is required!"),
];

export const CheckValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const errors:any = validationResult(req);
    if (!errors.isEmpty()) {        
      return res.status(400).json({ errors: errors.errors[0].msg });
    }

    return next();
  };