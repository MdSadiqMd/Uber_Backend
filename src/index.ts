import express, { Express } from "express";

import serverConfig from "./config/server.config";
import logger from "./config/logger.config";

const app: Express = express();

app.listen(serverConfig.PORT, async () => {
    logger.info(`Server started on PORT: ${serverConfig.PORT}`);
});