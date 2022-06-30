// @ts-nocheck
import { Router } from 'express';
import { redisClient } from '../modules/redis';
import WebSocketServer from 'ws';

const wss = new WebSocketServer.Server({ port:8081 });
wss.on("connection", ws => {
    ws.on("message", (message) => {
        if (message.toString() === "bridges") {
            ws.send(1000)
            redisClient.subscribe("gamebridges", (msg) => {
                ws.send(msg);
            })
        } else if (message.toString() === "tntrun") {
            ws.send(1000)
            redisClient.subscribe("gametntrun", (msg) => {
                ws.send(msg)
            });
        } else if (message.toString() === "parkour") {
            ws.send(1000)
            redisClient.subscribe("gameparkour", (msg) => {
                ws.send(msg)
            })
        } else return ws.send("1003");
    })
})

export const realtimeRouter = Router();