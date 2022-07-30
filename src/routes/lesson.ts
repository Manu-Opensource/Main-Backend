import Route from '../interfaces/route';
import { getDocument } from '../controllers/cms';
import express from 'express';

export default class Lesson implements Route {
    path = "lesson/:lessonId"
    timeoutTime = 30 * 1000
    timeoutRequests = 30

    run = (req: express.Request, res: express.Response): (void) => {
        getDocument("Lessons", req.params.lessonId).then(lesson => {
            if (lesson) res.send(lesson);
            else res.status(404).send(null);
        });
    }
}
