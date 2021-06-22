import { Response, Request } from 'express';
import moment from 'moment';
import { MailModel, MailListResponse, RecipientsModel } from '../models/mail.model';
import { mails, lokiDB } from '../utils/database';
import { v4 as uuidv4 } from 'uuid';

//send mail
export const sendMail = async (
  req: Request,
  res: Response
) => {
  const mail: MailModel = req.body;  
  mail.mail_id = uuidv4();
  mail.timestamp = new Date(new Date().getTime());
  mails.insertOne(mail);
  return res.json({ mail_id: mail.mail_id, timestamp: mail.timestamp });
};

//get mail
export const getMail = async (
  req: Request,
  res: Response
) => {
  const mail: MailModel = req.body;
  const mailCollection: Collection<MailModel> = lokiDB.getCollection<MailModel>("mails");
  const result: (MailModel & LokiObj)[] = mailCollection.where(function (obj) {
    return (obj.username === mail.username && obj.mail_id === mail.mail_id);
  });
  return res.json({ result });
};

//list mail
export const getAllMail = async (
  req: Request,
  res: Response
) => {
  const reqBody: MailModel = req.body;
  const MailIdList: MailListResponse[] = [];
  const mailCollection: Collection<MailModel> = lokiDB.getCollection<MailModel>("mails");
  const result = mailCollection.where((data: MailModel) => {
    return (
      data.recipients.filter(
        (data) =>
          data.username.toLowerCase() ==
          reqBody.username.toLowerCase() &&
          !data.isRead
      ).length > 0
    );
  });
  result.forEach((resultMail: MailModel & LokiObj) => {
    MailIdList.push({ mail_id: resultMail.mail_id });
    mailCollection.findAndUpdate(
      {
        $loki: resultMail.$loki,
      },
      (updateModel: MailModel) => {
        const isreadModel = updateModel.recipients.find((filterModel : RecipientsModel) => filterModel.username.toLowerCase() == reqBody.username.toLowerCase());
        if(isreadModel)
        {
          isreadModel.isRead = true
        }
      }
    );
  });
  return res.json({ MailIdList });
};