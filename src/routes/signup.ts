import Route from '../interfaces/route';
import { createUser } from '../controllers/user';
import { verify } from 'hcaptcha';
import express from 'express';
import dotenv from 'dotenv';
import Cookies from 'cookies';

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
        verify(process.env.HCAPTCHA_SECRET, req.query.captchaToken as string).then(async (data) => {
            if (data.success === true) {
                res.status(200);
                let jwt = await createUser(req.query.email as string, (req.query.password as string).replace("_POUNDSIGN_", "#"))
                if (jwt) {
                    const cookies = new Cookies(req, res);
                    cookies.set('Authorization', jwt, {
                        httpOnly: true
                    });
                    res.send("Success");
                }
            } else {
                res.status(401).send();
            }
        });
    }
}
