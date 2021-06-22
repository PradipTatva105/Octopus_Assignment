import { Response, Request, } from 'express';
import { Chance } from 'chance';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { describe, it } from 'mocha';
import * as httpMocks from 'node-mocks-http';
import loki from "lokijs";
import { MailModel } from "../models/mail.model";

const chance: Chance.Chance = new Chance();

const lokiDBMock = new loki(chance.string());
const mailsMock = lokiDBMock.addCollection<MailModel>("mails",{autoupdate: true});

const testMailController = proxyquire('../controllers/mail.controller', {
    '../utils/database': {
        mails: mailsMock,
        lokiDB: lokiDBMock
    }
});

const requestMock = httpMocks.createRequest();
const responseMock = httpMocks.createResponse();

const HttpStatusCode = {
    Ok: 200,
    InternalServerError: 500,
    NotFound: 404
};

describe('Mail Controller', () => {
    let sendMailMethods: (req: Request, res: Response) => Promise<Response>;
    let getMailMethods: (req: Request, res: Response) => Promise<Response>;
    let getAllMailMethods: (req: Request, res: Response) => Promise<Response>;
    
    let mailsRequest: MailModel;
    let mailsResponse: MailModel & LokiObj;

    beforeEach(() => {
        sendMailMethods = testMailController.sendMail;
        getMailMethods = testMailController.getMail;
        getAllMailMethods = testMailController.getAllMail;

        mailsRequest = {
            mail_id: chance.string(),
            username: chance.string(),
            message: chance.string(),
            timestamp: chance.date()
        } as MailModel;

        mailsResponse = {
            ...mailsRequest,
            $loki: chance.integer(),
            meta: {
                created: chance.integer(),
                revision: chance.integer(),
                updated: chance.integer(),
                version: chance.integer()
            }
        } as MailModel & LokiObj;
    });

    describe('Send Mail', () => {
        it('Should return mail id and timestamp', async () => {
            mailsMock.insertOne = (): (MailModel & LokiObj)  => {
                return mailsResponse;
            };

            requestMock.body = mailsRequest;
            await sendMailMethods(requestMock, responseMock);
            expect(responseMock.statusCode).to.equal(HttpStatusCode.Ok);
        });

    });

    describe('Get Mail', () => {
        it('Should return get mail object', async () => {
            lokiDBMock.getCollection = <F extends object = any>(): loki.Collection<F> => {
                return mailsMock as any;
            };

            requestMock.body = mailsRequest;
            await getMailMethods(requestMock, responseMock);

            expect(responseMock.statusCode).to.equal(HttpStatusCode.Ok);
        });
    });
    
    describe('Get All Mail', () => {
        it('Should return get recipient username by username success', async () => {
            mailsMock.findOne = () : (LokiObj & MailModel) | null => {
                return mailsResponse;
            };

            lokiDBMock.getCollection = <F extends object = any>(): loki.Collection<F> => {
                return mailsMock as any;
            };

            await getAllMailMethods(requestMock, responseMock);

            expect(responseMock.statusCode).to.equal(HttpStatusCode.Ok);
        });
    });
});