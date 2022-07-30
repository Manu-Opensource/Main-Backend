import Route from '../interfaces/route';
import express from 'express';

export default class Ping implements Route {
    path = "ping"
    timeoutTime = 60 * 1000
    timeoutRequests = 200

    run = (req: express.Request, res: express.Response): (void) => {
        res.send("Pong");
    }
}
