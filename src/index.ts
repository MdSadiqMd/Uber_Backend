import bodyParser from "body-parser";
import express, { Express } from "express";

import { serverConfig, logger, db } from './config';
import apiRouter from "./routes";

const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.use('/api', apiRouter);

app.listen(serverConfig.PORT, async () => {
    logger.info(`Server started on PORT: ${serverConfig.PORT}`);
    await db.connect();
});