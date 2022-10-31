import Route from '../interfaces/route';
import { getCollection } from '../controllers/cms';
import express from 'express';

export default class Courses implements Route {
    path = "courses"
    timeoutTime = 30 * 1000
    timeoutRequests = 30

    run = (req: express.Request, res: express.Response): (void) => {
        getCollection("Course").then(courses => {
            res.send(courses);
        });
    }
}
