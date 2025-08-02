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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_config_1 = require("./config/env.config");
const seedAdmin_1 = require("./utils/seedAdmin");
let server;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(env_config_1.ENV.DB_URL);
        console.log("Connect to DB!!");
        server = app_1.default.listen(env_config_1.ENV.PORT, () => {
            console.log(`App listen successfully on port ${env_config_1.ENV.PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
//IFI
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield startServer();
    yield (0, seedAdmin_1.seedAdmin)();
}))();
//SIGTERM handling others server shurt down
process.on("SIGTERM", () => {
    console.log("SIGTERM signal recieved... Server shurtting down...");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
//SIGINT manually handling for server shurt down
process.on("SIGINT", () => {
    console.log("SIG INT signal recieved... Server shurtting down...");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
//4 types of server error handling below
//unhandledRejection error handling
process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection detected... Server shurtting down...", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
//uncaughtException erro handling
process.on("uncaughtException", (err) => {
    console.log("uncaught exception detected... Server shurtting down...", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
