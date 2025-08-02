import "./config/passport.config";
import express, { Request, Response } from "express";
import cors from "cors";
import expressSessios from "express-session"
import { notFoundError } from "./middlewares/notFoundRouteError";

import cookieParser from "cookie-parser";
import passport from "passport";
import { router } from "./routes";
import { globalErrorHandler } from "./middlewares/globalError";
import { ENV } from "./config/env.config";

const app = express();
//required middleware

app.use(
  expressSessios({
    secret: ENV.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

//bypass all routes
app.use("/api/v1", router);

//test route
app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: "Welcome to Ride-Booking-System backend😊" });
});

//error middlewares
app.use(globalErrorHandler);
app.use(notFoundError);
export default app;