import Route from '@interfaces/route';
import { getCollections } from '../controllers/cms';
import express from 'express';

export default class Collections implements Route {
    path = "collections"

    run = (req: express.Request, res: express.Response): (void) => {
        getCollections().then(collections => {
            res.send(collections);
        });
    }
}
