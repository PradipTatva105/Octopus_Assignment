import loki from "lokijs";
import { MailModel, RecipientsModel } from "../models/mail.model";

const lokiDB = new loki("mail_service_db.json", {
  autosave: true,
  autosaveInterval: 100,
  autoload: true,
  persistenceMethod: 'localStorage'
});

const mails = lokiDB.addCollection<MailModel>("mails", { autoupdate: true });

const recipients = lokiDB.addCollection<RecipientsModel>("recipients", { autoupdate: true });

export { lokiDB, mails, recipients };
