import Route from '../interfaces/route';
import express from 'express';

export default class ValidateEmail implements Route {
    path = "validate-email"
    timeoutTime = 60 * 1000
    timeoutRequests = 50

    run = (req: express.Request, res:express.Response): (void) => {
        let email = req.query.email as string; 
        let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (re.test(email)) {
            res.status(200).send(true)
        } else {
            res.status(200).send("Invalid Email")
        }

    }
}
