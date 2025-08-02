/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { ENV } from "./config/env.config";
import { seedAdmin } from "./utils/seedAdmin";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(ENV.DB_URL);
    console.log("Connect to DB!!");
    server = app.listen(ENV.PORT, () => {
      console.log(`App listen successfully on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
//IFI
(async () => {
 await startServer();
 await seedAdmin()
})();

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


