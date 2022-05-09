const express = require('express');
const router = express.Router();
const db = require('../modules/db');
const fs = require('fs');
const path = require('path');

// Canvas
const { createCanvas, loadImage } = require('canvas')
const width = 768
const height = 214
const canvas = createCanvas(width, height)
const context = canvas.getContext('2d')

router.get('/:user', async (req, res) => {
    if(!req.params.user) return res.status(404).json({"status": 404,"message":"Player parameter missing"});
    const data = await db("SELECT * FROM bridges WHERE player=?", [req.params.user]);
    const itemData = await db("SELECT * FROM bridgesItems where player=?", [req.params.user]);

    if(!data) return res.status(404).json({"status":404,"message":"Player not found in database"});
    else {
        const obj = {
            "status": 200,
            "data": {
                "name": data.player,
                "points": data.points,
            }
        }

        if (itemData) obj.data.itemSlots = {
            "sword": itemData.sword,
            "pickaxe": itemData.pickaxe,
            "concrete1": itemData.concrete1,
            "concrete2": itemData.concrete2,
            "bow": itemData.bow,
            "gap": itemData.gap
        }

        return res.status(200).json(obj);
    }
});

router.get('/:user/image', async (req, res) => {
    const itemData = await db("SELECT * FROM bridgesItems where player=?", [req.params.user]);
    if(!itemData) return res.status(404).json({"status":404,"message":"Player not found in database"});

    const images = [];
    images.push(await loadImage(path.resolve(__dirname, '../images/hotbar.png')));
    images.push(await loadImage(path.resolve(__dirname, '../images/item_images/sword.png')));
    images.push(await loadImage(path.resolve(__dirname, '../images/item_images/concrete.png')));
    images.push(await loadImage(path.resolve(__dirname, '../images/item_images/bow.png')));
    images.push(await loadImage(path.resolve(__dirname, '../images/item_images/gap.png')));
    images.push(await loadImage(path.resolve(__dirname, '../images/item_images/pickaxe.png')));

    // Hotbar
    context.drawImage(images[0], 0, 0, width, height);

    const x = {
        "0": 43,
        "1": 121,
        "2": 199,
        "3": 277,
        "4": 355,
        "5": 433,
        "6": 511
    }

    // Sword
    context.drawImage(images[1], x[itemData.sword], 145, 50, 50);

    // Concrete 1
    context.drawImage(images[2], x[itemData.concrete1], 145, 50, 50);

    // Concrete 2
    context.drawImage(images[2], x[itemData.concrete2], 145, 50, 50);

    // Bow
    context.drawImage(images[3], x[itemData.bow], 145, 50, 50);

    // Gapple
    context.drawImage(images[4], x[itemData.gap], 145, 50, 50);

    // Pickaxe
    context.drawImage(images[5], x[itemData.pickaxe], 145, 50, 50);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./images/image.png', buffer);

    res.type='image/png';
    res.sendFile(path.join(__dirname, `../images/${req.user.params}.png`));
})

module.exports = router;