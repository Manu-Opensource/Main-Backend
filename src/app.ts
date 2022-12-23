import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import database from './controllers/database';

database.connect();

const FRONTEND_LINK = "http://localhost:3000"
//const FRONTEND_LINK = "http://127.0.0.1:3000"

function initExpress(): express.Application {
    const app = express();
    app.use(cors({
        origin: FRONTEND_LINK,
        credentials: true,
    }));
    return app;
}

function handleRoutes(app: express.Application) {
    fs.readdirSync(path.resolve(__dirname, "./routes")).forEach((file) => {
        const route = new (require(`./routes/${file}`).default)
        console.log(route);

        if (route.timeoutTime && route.timeoutRequests) {
            const limiter = rateLimit({
                windowMs: route.timeoutTime,
                max: route.timeoutRequests,
                standardHeaders: true,
                legacyHeaders: false,
            });
            app.use(`/api/${route.path}`, limiter);
        }
        app.get(`/api/${route.path}`, route.run);
    });
    app.listen(3003);
}

export default function run() {
    console.log("Running");
    const app = initExpress();
    handleRoutes(app);
}
