// @ts-nocheck
import { Router } from 'express';
import { query } from '../modules/db';
import { createClient } from 'redis';

export const authRoute = Router();

const redisClient = createClient();
redisClient.connect();

authRoute.post('/auth', async (req, res) => {
    if (!req.query.ign || !req.query.token || !req.query.id) return res.status(400).json({"status":400,"message":"No user or token provided."});
    const d = await query("SELECT * FROM linked WHERE ign=?", [req.query.ign]);
    if(d.length !== 0) return res.status(409).json({"status":409,"message":"User is already linked to " + d[0].ign})

    const key = await redisClient.get(req.query.ign);

    if (!key) return res.status(500).json({"status":500,"message":"Uh oh! There was no token created for that user."});
    else {
        redisClient.del(req.query.ign);
        query("INSERT INTO linked VALUES (?,?)", [req.query.ign, req.query.id]);

        return res.status(200).json({"status":200,"message":"Successfully authenticated user."});
    }
})

authRoute.delete('/auth', async (req, res) => {
    if (!req.query.id) return res.status(400).json({"status":400,"message":"No user provided."});
    const d = await query("SELECT * FROM linked WHERE id=?", [req.query.id]);
    if(d.length === 0) return res.status(404).json({"status":404,"message":"User is not linked to any account."})

    query("DELETE FROM linked WHERE id=?", [req.query.id]);
    return res.status(200).json({"status":200,"message":"Successfully unlinked user."});
})

authRoute.get('/auth/@me', async (req, res) => {
    if (!req.query.ign) return res.status(400).json({"status":400,"message":"No user provided"});
    await query("SELECT * FROM linked WHERE ign=?", [req.query.ign])
    .then(async (d) => {
        if (d.length === 0) return res.status(404).json({"status":404,"message":"User is not linked to any account"});

        return res.status(200).json({
            "status":200,
            "user": {
                "ign": req.query.ign,
                "id": d[0].id
            }
        })
    })
    .catch((err) => {
        return res.status(500).json({
            "status":500,
            "type": "sql_error",
            "message": "Uh oh. Something went wrong. Call Saul",
            "errorObject": {
                "code": err.code,
                "sql": err.sql
            }
        })
    });
})