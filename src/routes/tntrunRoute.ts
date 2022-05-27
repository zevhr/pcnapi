// @ts-nocheck
import { Router } from 'express';
import { query } from '../modules/db';

export const tntrunRoute = Router();

tntrunRoute.get('/tntrun', async (req, res) => {
    if (!req.query.username) return res.status(400).json({"status":400,"message":"No username query parameter provided"});
    const tdata = await query("SELECT * FROM tntrun WHERE player=?", [req.query.username]);
    if (tdata.length === 0) return res.status(404).json({"status":404,"message":"That user doesn't exist in the database."});
    return res.status(200).json({"status":200,"username":req.query.username,"points":tdata[0].points})
})

tntrunRoute.get('/tntrun/history', async (req, res) => {
    let th;
    if (req.query.user) {
        if (req.query.limit) th = await query(`SELECT * FROM tntrunHistory WHERE json LIKE ? LIMIT ?`, [`%${req.query.user}%`, Number(req.query.limit)]);
        else th = await query('SELECT * FROM tntrunHistory WHERE json LIKE ?', [`%${req.query.user}%`]);
    } else {
        if (req.query.limit) th = await query("SELECT * FROM tntrunHistory LIMIT ?", [Number(req.query.limit)]);
        else th = await query("SELECT * FROM tntrunHistory", null);
    }

    return res.status(200).json({"status":200,"games":th});
})