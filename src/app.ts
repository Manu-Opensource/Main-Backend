import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';

const FRONTEND_LINK = "http://localhost:3000"

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
        app.get(`/api/${route.path}`, route.run);
    });
    app.listen(3003);
}

export default function run() {
    console.log("Running");
    const app = initExpress();
    handleRoutes(app);
}
