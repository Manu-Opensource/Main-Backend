import Route from "../interfaces/route";
import express from 'express';
import Cookies from 'cookies';

export default class Signout implements Route {
    path = "signout"
    timeoutTime = 60 * 1000;
    timeoutRequests = 5

    run = (req: express.Request, res: express.Response): (void) => {
        const cookies = new Cookies(req, res);
        cookies.set('Authorization', "", {
            httpOnly: true
        });
        res.send("Success");
    }
}

