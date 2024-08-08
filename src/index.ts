import bodyParser from "body-parser";
import express, { Express } from "express";

import { serverConfig, logger } from './config';

const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.listen(serverConfig.PORT, async () => {
    logger.info(`Server started on PORT: ${serverConfig.PORT}`);
});