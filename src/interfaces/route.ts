import express from 'express';

export default interface Route {
    path: string,
    run: (req: express.Request, res: express.Response) => (void)
};
