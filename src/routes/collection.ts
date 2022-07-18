import Route from '../interfaces/route';
import { getCollection } from '../controllers/cms';
import express from 'express';

export default class Collection implements Route {
    path = "collection/:collectionName"

    run = (req: express.Request, res: express.Response): (void) => {
        getCollection(req.params.collectionName).then(collection => {
            if (collection) res.send(collection);
            else res.status(404).send(null);
        });
    }
}
