// @ts-nocheck
import { Router } from 'express';
import { query } from '../modules/db';
import { redisClient } from '../modules/redis';

const tobj = {};
const bobj = {};
redisClient.subscribe("gametntrun", (message) => {
    tobj = JSON.parse(message);
});
redisClient.subscribe("gamebridges", (message) => {
    bobj = JSON.parse(message);
})

export const realtimeRouter = Router();

realtimeRouter.get('/bridges/_realtime', async (req, res) => {
    return res.status(200).json(bobj);
})

realtimeRouter.get('/tntrun/_realtime', async (req, res) => {
    return res.status(200).json(tobj);
})