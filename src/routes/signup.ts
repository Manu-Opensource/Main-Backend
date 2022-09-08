import Route from '../interfaces/route';
import express from 'express';
import { verify } from 'hcaptcha';
import dotenv from 'dotenv';
import { createUser } from '../controllers/user';

dotenv.config();

export default class Signup implements Route {
    path = "signup"
    timeoutTime = 60 * 1000
    timeoutRequests = 5

    run = (req: express.Request, res: express.Response): (void) => {
        if (!req.query.captchaToken || typeof(req.query.captchaToken) != "string") {
            res.status(400).send();
            return;
        }
        verify(process.env.HCAPTCHA_SECRET, req.query.captchaToken as string).then((data) => {
            console.log(data.success);
            if (data.success === true) {
                res.status(200);
                createUser(req.query.email as string, req.query.password as string)
            } else {
                res.status(401).send();
            }
        });
    }
}
