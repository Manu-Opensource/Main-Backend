import Route from "../interfaces/route";
import express from 'express';
import Cookies from 'cookies';
import {loginUser} from "../controllers/user";

export default class Signin implements Route {
    path = "signin"
    timeoutTime = 60 * 1000;
    timeoutRequests = 5

    run = async (req: express.Request, res: express.Response): (Promise<void>) => {
        let [validLogin, resp] = await loginUser(req.query.email as string, (req.query.password as string).replace("_POUNDSIGN_", "#"))
        if (validLogin) {
            const cookies = new Cookies(req, res);
            cookies.set('Authorization', resp, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 30,
            });
            res.send(resp);
        } else {
            res.status(401).send(resp);
        }
    }
}

