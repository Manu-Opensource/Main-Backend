import Route from '../interfaces/route';
import { getDocument } from '../controllers/cms';
import express from 'express';

export default class Course implements Route {
    path = "course/:courseId"

    run = (req: express.Request, res: express.Response): (void) => {
        getDocument("Course", req.params.courseId).then(course => {
            if (course) res.send(course);
            else res.status(404).send(null);
        });
    }
}
