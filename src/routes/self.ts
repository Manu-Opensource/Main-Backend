import Route from '../interfaces/route';
import express from 'express';
import Cookies from 'cookies';
import { decodeUserJWT, getUser } from '../controllers/user';

export default class Self implements Route {
    path = "self"
    timeoutTime = 15 * 1000
    timeoutRequests = 60

    run = async (req: express.Request, res: express.Response) : (Promise<void>) => {
        const cookies = new Cookies(req, res); 
        let jwt = cookies.get('Authorization');
        if (!jwt)
            res.status(401).send("No Authorization Cookie");
        else {
            let resp = decodeUserJWT(jwt)
            if (resp)
                res.status(200).send(await getUser(resp.id));
            else
                res.status(401).send("Invalid Authorization Cookie");
        }
    }
}
