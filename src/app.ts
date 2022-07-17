import fs from 'fs';
import path from 'path';
import express from 'express';

function initExpress(): express.Application {
    const app = express();
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
