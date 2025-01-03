"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Server as HttpServer } from "http";
// import { Server as SocketIOServer } from "socket.io";
const mongoose_1 = __importDefault(require("mongoose"));
const DB_1 = __importDefault(require("./DB"));
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const socket_1 = require("./utils/socket");
// import { createServer } from "node:http";
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer(app_1.default);
(0, socket_1.initSocketIO)(server);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            yield mongoose_1.default.connect(config_1.DATABASE_URL);
            console.log("mongodb connected successfully");
            // Seed super admin data
            yield (0, DB_1.default)();
            // Create the HTTP server
            server.listen(config_1.PORT, () => {
                console.log(`Server is running on ${config_1.PORT}`);
            });
        }
        catch (error) {
            console.error("Error in main function:", error);
            process.exit(1);
        }
    });
}
main().catch((error) => {
    console.error("Unhandled error in main:", error);
    process.exit(1);
});
// Gracefully handle unhandled rejections
process.on("unhandledRejection", (err) => {
    console.error(`😈 unhandledRejection is detected, shutting down ...`, err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
// Gracefully handle uncaught exceptions
process.on("uncaughtException", (error) => {
    console.error(`😈 uncaughtException is detected, shutting down ...`, error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
