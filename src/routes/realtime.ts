// @ts-nocheck
import { Router } from 'express';
import { redisClient } from '../modules/redis';
import WebSocketServer from 'ws';

const wss = new WebSocketServer.Server({ port:8081 });
wss.on("connection", ws => {
    ws.on("message", (message) => {
        if (message.toString() === "bridges") {
            ws.send("Subscribed to bridges!")
            redisClient.subscribe("gamebridges", (msg) => {
                ws.send(msg);
            })
        } else if (message.toString() === "tntrun") {
            ws.send("Subscribed to TNTRUN!")
            redisClient.subscribe("gametntrun", (msg) => {
                ws.send(msg)
            });
        } else if (message.toString() === "parkour") {
            ws.send("Subscribed to parkour!")
            redisClient.subscribe("gameparkour", (msg) => {
                ws.send(msg)
            })
        }
    })
})

export const realtimeRouter = Router();