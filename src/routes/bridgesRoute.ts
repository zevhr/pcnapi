// @ts-nocheck
import { Router } from 'express';
import { query } from '../modules/db';
import { loadImage, createCanvas } from 'canvas';
import path from 'path';
import fs from 'fs';

export const bridgesRoute = Router();

// Canvas Config
const width = 728
const height = 159
const canvas = createCanvas(width, height)
const context = canvas.getContext('2d')

bridgesRoute.get('/bridges', async (req, res) => {
    if (!req.query.username) return res.status(400).json({"status":400,"message":"No username query parameter provided"});
        const data = await query("SELECT * FROM bridges WHERE player=?", [req.query.username]);
        const itemData = await query("SELECT * FROM bridgesItems where player=?", [req.query.username]);
        if (data.length === 0) return res.status(404).json({"status":404,"message":"That user doesn't exist in the database."});

        const image = await generateImage(req.query.username)
        const user = {
            "kills": data[0].kills,
            "points": data[0].points,
            "hotbarImage":"",
            "itemData": {
                "sword": Math.round(parseInt(itemData[0].sword, 10) + 1),
                "bow": Math.round(parseInt(itemData[0].bow, 10) + 1),
                "concrete1": Math.round(parseInt(itemData[0].concrete1, 10) + 1),
                "concrete2": Math.round(parseInt(itemData[0].concrete2, 10) + 1),
                "gap": Math.round(parseInt(itemData[0].gap, 10) + 1),
                "pickaxe": Math.round(parseInt(itemData[0].pickaxe, 10) + 1)
            }
        }

        if (image) user.hotbarImage = image;

        return res.status(200).json({"status":200,"username":req.query.username,user});
})

bridgesRoute.get('/bridges/history', async (req, res) => {
    let th;
    if (req.query.user) {
        if (req.query.limit) th = await query(`SELECT * FROM bridgesHistory WHERE json LIKE ? LIMIT ?`, [`%${req.query.user}%`, Number(req.query.limit)]);
        else th = await query('SELECT * FROM bridgesHistory WHERE json LIKE ?', [`%${req.query.user}%`]);
    } else {
        if (req.query.limit) th = await query("SELECT * FROM bridgesHistory LIMIT ?", [Number(req.query.limit)]);
        else th = await query("SELECT * FROM bridgesHistory", null);
    }

    return res.status(200).json({"status":200,"games":th});
})

bridgesRoute.post("/bridges/itemData", async (req, res) => {
    if (!req.body || !req.body.itemData || !req.body.user) return res.status(400).json({"status":400,"message":"No itemData or user object(s) provided"});

    const body = req.body.itemData;
    if (!body.sword || !body.concrete1 || !body.concrete2 || !body.pickaxe || !body.bow || !body.gap) return res.status(400).json({"status":400,"message":"An expected key is missing. Please check your object."})

    const d = await query("SELECT * FROM bridgesItems WHERE player=?", [req.body.user])
    if (!d[0]) {
        return res.status(404).json({"status":404,"message":"User is not in database"})
    } else {
        query("UPDATE bridgesItems SET sword=?, concrete1=?, concrete2=?, pickaxe=?, bow=?, gap=? WHERE player=?", [body.sword, body.concrete1, body.concrete2, body.pickaxe, body.bow, body.gap, req.body.user]);
        return res.status(200).json({"status":200,"message":"Table successfully updated"});
    }
})

export async function generateImage(ign) {
    const itemData = await query("SELECT * FROM bridgesItems where player=?", [ign]);
    if(itemData.length === 0) return false;

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
        "6": 494,
        "7": 571,
        "8": 648
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

    return canvas.toDataURL('image/png');
}