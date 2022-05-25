// @ts-nocheck
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createClient } from 'redis';
import { query } from '../modules/db';
import { createCanvas, loadImage } from 'canvas';

const redisClient = createClient();
redisClient.connect();

let tobj = {};
let bobj = {};
redisClient.subscribe("gametntrun", (message) => {
    tobj = JSON.parse(message);
});
redisClient.subscribe("gamebridges", (message) => {
    bobj = JSON.parse(message);
})

// Canvas Config
const width = 728
const height = 159
const canvas = createCanvas(width, height)
const context = canvas.getContext('2d')

export const register = (app: express.Application) => {
    app.get('/', (req, res) => {
        return res.status(200).json({
            "status": "ok",
            "appAuthor": "PlagueCraft Network Team",
            "appDescription": "PlagueCraft REST API",
            "appOwner": "Awex"
        })
    })

    // PCN RealTime
    app.get("/:game/_realtime", async (req, res) => {
        if (req.params.game === "bridges") return res.status(200).json(bobj)
        else if (req.params.game === "tntrun") return res.status(200).json(tobj)
    })

    // Game APIs
    app.get('/:game/history', async (req, res) => {
        let th;
        if (req.params.game === "tntrun") {
            if (req.query.user) {
                if (req.query.limit) th = await query(`SELECT * FROM tntrunHistory WHERE json LIKE ? LIMIT ?`, [`%${req.query.user}%`, Number(req.query.limit)]);
                else th = await query('SELECT * FROM tntrunHistory WHERE json LIKE ?', [`%${req.query.user}%`]);
            } else {
                if (req.query.limit) th = await query("SELECT * FROM tntrunHistory LIMIT ?", [Number(req.query.limit)]);
                else th = await query("SELECT * FROM tntrunHistory", null);
            }

            return res.status(200).json({"status":200,"games":th});
        } else if (req.params.game === "bridges") {
            if (req.query.user) {
                if (req.query.limit) th = await query(`SELECT * FROM bridgesHistory WHERE json LIKE ? LIMIT ?`, [`%${req.query.user}%`, Number(req.query.limit)]);
                else th = await query('SELECT * FROM bridgesHistory WHERE json LIKE ?', [`%${req.query.user}%`]);
            } else {
                if (req.query.limit) th = await query("SELECT * FROM bridgesHistory LIMIT ?", [Number(req.query.limit)]);
                else th = await query("SELECT * FROM bridgesHistory", null);
            }

            return res.status(200).json({"status":200,"games":th});
        } else return res.status(404).json({"status":404,"message":"This game either doesn't exist or does not support PCN RealTime.","expected":['tntrun','bridges']});
    })

    app.get('/:game', async (req, res) => {
        if (!req.query.username) return res.status(400).json({"status":400,"message":"No username query parameter provided"});
        if (req.params.game === "bridges") {
            const data = await query("SELECT * FROM bridges WHERE player=?", [req.query.username]);
            const itemData = await query("SELECT * FROM bridgesItems where player=?", [req.query.username]);
            if (data.length === 0) return res.status(404).json({"status":404,"message":"That user doesn't exist in the database."});

            const user = {
                "kills": data[0].kills,
                "points": data[0].points,
                "itemData": {
                    "sword": itemData[0].sword,
                    "bow": itemData[0].bow,
                    "concrete1": itemData[0].concrete1,
                    "concrete2": itemData[0].concrete2,
                    "gap": itemData[0].gap,
                    "pickaxe": itemData[0].pickaxe
                }
            }

            return res.status(200).json({"status":200,"username":req.query.username,user});
        } else if (req.params.game === "tntrun") {
            const tdata = await query("SELECT * FROM tntrun WHERE player=?", [req.query.username]);
            if (tdata.length === 0) return res.status(404).json({"status":404,"message":"That user doesn't exist in the database."});
            return res.status(200).json({"status":200,"username":req.query.username,"points":tdata[0].points})
        } else if (req.params.game === "all") {
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
        } else return res.status(404).json({"status":404,"message":"Incorrect game parameter","expected":["tntrun","bridges","all"]});
    })

    app.get('/bridges/image', async (req, res) => {
        const itemData = await query("SELECT * FROM bridgesItems where player=?", [req.query.username]);
        if(itemData.length === 0) return res.status(404).json({"status":404,"message":"That user doesn't exist in the database."});

        const images = [];
        images.push(await loadImage(path.resolve(__dirname, '../images/hotbar.png')));
        images.push(await loadImage(path.resolve(__dirname, '../images/item_images/sword.png')));
        images.push(await loadImage(path.resolve(__dirname, '../images/item_images/concrete.png')));
        images.push(await loadImage(path.resolve(__dirname, '../images/item_images/bow.png')));
        images.push(await loadImage(path.resolve(__dirname, '../images/item_images/gap.png')));
        images.push(await loadImage(path.resolve(__dirname, '../images/item_images/pickaxe.png')));

        // Hotbar
        context.drawImage(images[0], 0, 0, width, height);

        interface Positions {
            [key: string]: number;
        }

        const x: Positions = {
            "0": 28,
            "1": 105,
            "2": 182,
            "3": 259,
            "4": 338,
            "5": 415,
            "6": 494
        }

        // Sword
        context.drawImage(images[1], x[itemData[0].sword], 92, 50, 50);

        // Concrete 1
        context.drawImage(images[2], x[itemData[0].concrete1], 92, 50, 50);

        // Concrete 2
        context.drawImage(images[2], x[itemData[0].concrete2], 92, 50, 50);

        // Bow
        context.drawImage(images[3], x[itemData[0].bow], 92, 50, 50);

        // Gapple
        context.drawImage(images[4], x[itemData[0].gap], 92, 50, 50);

        // Pickaxe
        context.drawImage(images[5], x[itemData[0].pickaxe], 92, 50, 50);

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(path.resolve(__dirname, `../images/${req.query.username.toLowerCase()}.png`), buffer);
        res.sendFile(path.join(__dirname, `../images/${req.query.username.toLowerCase()}.png`));
    })
}