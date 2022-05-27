// @ts-nocheck
import { Router } from 'express';
import { query } from '../modules/db';

export const generalRoute = Router();

generalRoute.get('/all', async (req, res) => {
    if (!req.query.username) return res.status(400).json({"status":400,"message":"No username query parameter provided"});
    const data = await query("SELECT * FROM bridges WHERE player=?", [req.query.username]);
    const itemData = await query("SELECT * FROM bridgesItems where player=?", [req.query.username]);
    const tdata = await query("SELECT * FROM tntrun WHERE player=?", [req.query.username]);
    if (data.length === 0) return res.status(404).json({"status":404,"message":"That user doesn't exist in the database."});

    const user = {
        "bridges": {
            "kills": data[0].kills,
            "points": data[0].points,
            "itemData": {
                "bow": itemData[0].bow,
                "concrete1": itemData[0].concrete1,
                "concrete2": itemData[0].concrete2,
                "gap": itemData[0].gap,
                "pickaxe": itemData[0].pickaxe
            },
        },
        "tntrun": {
            "points": tdata[0].points
        }
    }

    return res.status(200).json({"status":200,"username":req.query.username,user});
})

