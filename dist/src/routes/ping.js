"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Ping {
    constructor() {
        this.path = "ping";
        this.run = (req, res) => {
            res.send("Pong");
        };
    }
}
exports.default = Ping;
