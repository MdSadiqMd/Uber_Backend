import bodyParser from "body-parser";
import express, { Express } from "express";
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { serverConfig, logger, db, redisClient } from './config';
import apiRouter from "./routes";
import { locationService } from "./services";

const app: Express = express();
app.use(cors({
    origin: serverConfig.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

const server = http.createServer(app);
export const io = new SocketIOServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use('/api', apiRouter);

server.listen(serverConfig.PORT, async () => {
    logger.info(`Server started on PORT: ${serverConfig.PORT}`);
    await db.connect();
});

redisClient.on('connect', () => {
    logger.info(`Connected to Redis`);
});

io.on('connection', async (socket) => {
    logger.info(`A User Connected with Socket: ${socket.id}`);
    socket.on('registerDriver', async (driverId) => {
        await locationService.setDriverSocket(driverId, socket.id);
        logger.info(`Driver Connected with Id: ${driverId}`);
    });

    socket.on('disconnect', async () => {
        const driverId = await locationService.getDriverSocket(`driver:${socket.id}`);
        if (driverId) {
            await redisClient.del(`driver:${driverId}`);
            logger.info(`Driver Disconnected with Id: ${driverId}`);
        }
    });
});
