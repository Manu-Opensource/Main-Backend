import Route from "../interfaces/route";
import express from 'express';
import Cookies from 'cookies';
import { decodeUserJWT, getUser, updateUser } from '../controllers/user';

export default class CompleteLesson implements Route {
    path = "completelesson/:lessonId"
    timeoutTime = 10 * 1000;
    timeoutRequests = 10

    run = async (req: express.Request, res: express.Response): (Promise<void>) => {
        const cookies = new Cookies(req, res); 
        let jwt = cookies.get('Authorization');
        if (!req.params.lessonId) {
            res.status(400).send("Missing Lesson Id Query Parameter");
        }
        if (!jwt)
            res.status(401).send("No Authorization Cookie");
        else {
            let resp = decodeUserJWT(jwt)
            if (resp) {
                let user = await getUser(resp.id);
                console.log(user);
                console.log(user.completedLessons);
                if (req.query.complete) {
                    user.completedLessons.push(req.params.lessonId as string);
                } else {
                    user.completedLessons.splice(user.completedLessons.indexOf(req.params.lessonId as string), 1);
                }
                updateUser(user)
            } else
                res.status(401).send("Invalid Authorization Cookie");
        }
    }
}

