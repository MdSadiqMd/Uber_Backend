import bodyParser from "body-parser";
import express, { Express } from "express";
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { serverConfig, logger, db, redisClient } from './config';
import apiRouter from "./routes";
import { locationService } from "./services";

const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

const server = http.createServer(app);
export const io = new SocketIOServer(server, {
    cors: {
        origin: serverConfig.FRONTEND_URL,
        methods: ["GET", "POST"]
    }
});

app.use('/api', apiRouter);

app.listen(serverConfig.PORT, async () => {
    logger.info(`Server started on PORT: ${serverConfig.PORT}`);
    await db.connect();
});

redisClient.on('connect', () => {
    logger.info(`Connected to Redis`);
});

io.on('connection', (socket) => {
    logger.info(`A User Connected with Socket: ${socket}`);
    socket.on('registerDriver', async (driverId) => {
        await locationService.setDriverSocket(driverId, socket.id);
        logger.info(`Drived Connected with Id: ${driverId}`);
    });

    socket.on('disconnect', async () => {
        logger.info(`Driver disconnected`);
        const driverId = await locationService.getDriverSocket(`driver:${socket.id}`);
        if (driverId) {
            await redisClient.del(`Driver Disconnected with Id: ${driverId}`);
        }
    });
});