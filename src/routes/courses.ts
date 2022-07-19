import Route from '../interfaces/route';
import { getCollection } from '../controllers/cms';
import express from 'express';

export default class Courses implements Route {
    path = "courses"

    run = (req: express.Request, res: express.Response): (void) => {
        getCollection("Courses").then(courses => {
            res.send(courses);
        });
    }
}
