import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import bodyParser from "body-parser";
import router from "./src/routes/index.js";
import Engine from "./src/utils/engine.js";
import database from "./src/db/index.js";

dotenv.config();

class App {
  configureServer = () =>
    new Promise((resolve) => {
      const app = express();
      app.use(cors());
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use(bodyParser.urlencoded({ extended: false }));
      app.use("/api/v1", router);
      resolve(app);
    });

  startServer = (app) =>
    new Promise((resolve) => {
      const port = process.env.PORT || 4000;
      const server = http.createServer(app);
      server.listen(port, () => {
        console.log("4. server started on:", `http://localhost:${port}/api/v1`);
        resolve(server);
      });
    });

  dbConfiguration = async (app) => {
    try {
      await database.connection();
      console.log("1. database connected.");
      return app;
    } catch (error) {
      console.log("error", error);
      throw error; // Rethrow the error to ensure the process doesn't continue on failure
    }
  };

  async init() {
    const app = await this.configureServer();
    await this.dbConfiguration(app);
    return this.startServer(app);
  }
}

export default async function () {
  const appInstance = new App();
  return appInstance.init();
}
