import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

import userRouter from './auth.routes';
import passengerRoutes from './passenger.routes';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
});

const v1Router = express.Router();

v1Router.use("/auth", userRouter);
v1Router.use('/passengers', passengerRoutes(io));

export default v1Router;