"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
function initExpress() {
    const app = (0, express_1.default)();
    return app;
}
function handleRoutes(app) {
    fs_1.default.readdirSync(path_1.default.resolve(__dirname, "./routes")).forEach((file) => {
        const route = new (require(`./routes/${file}`).default);
        console.log(route);
        app.get(`/api/${route.path}`, route.run);
    });
    app.listen(3003);
}
function run() {
    console.log("Running");
    const app = initExpress();
    handleRoutes(app);
}
exports.default = run;
