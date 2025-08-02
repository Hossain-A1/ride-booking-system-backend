"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/passport.config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const notFoundRouteError_1 = require("./middlewares/notFoundRouteError");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const routes_1 = require("./routes");
const globalError_1 = require("./middlewares/globalError");
const env_config_1 = require("./config/env.config");
const app = (0, express_1.default)();
//required middleware
app.use((0, express_session_1.default)({
    secret: env_config_1.ENV.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
//bypass all routes
app.use("/api/v1", routes_1.router);
//test route
app.get("/", (req, res) => {
    res
        .status(200)
        .json({ message: "Welcome to Ride-Booking-System backend😊" });
});
//error middlewares
app.use(globalError_1.globalErrorHandler);
app.use(notFoundRouteError_1.notFoundError);
exports.default = app;
