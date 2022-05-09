const express = require('express');
const router = express.Router();
const db = require('../modules/db');
const fs = require('fs');
const path = require('path');

// Canvas
const { createCanvas, loadImage } = require('canvas')
const width = 728
const height = 159
const canvas = createCanvas(width, height)
const context = canvas.getContext('2d')

router.get('/:user', async (req, res) => {
    if(!req.params.user) return res.status(404).json({"status": 404,"message":"Player parameter missing"});
    const data = await db("SELECT * FROM bridges WHERE player=?", [req.params.user]);
    const itemData = await db("SELECT * FROM bridgesItems where player=?", [req.params.user]);

    if(!data) {
        res.type='image/png';
        return res.sendFile(path.join(__dirname, `../images/default.png`));
    } else {
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
    const data = await db("SELECT * FROM bridges where player=?", [req.params.user]);
    const itemData = await db("SELECT * FROM bridgesItems where player=?", [req.params.user]);
    if(!itemData && !data) return res.status(404).json({"status":404,"message":"Player not found in database"});

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
        "0": 28,
        "1": 105,
        "2": 182,
        "3": 259,
        "4": 338,
        "5": 415,
        "6": 494
    }

    // Sword
    context.drawImage(images[1], x[itemData.sword], 90, 50, 50);

    // Concrete 1
    context.drawImage(images[2], x[itemData.concrete1], 90, 50, 50);

    // Concrete 2
    context.drawImage(images[2], x[itemData.concrete2], 90, 50, 50);

    // Bow
    context.drawImage(images[3], x[itemData.bow], 90, 50, 50);

    // Gapple
    context.drawImage(images[4], x[itemData.gap], 90, 50, 50);

    // Pickaxe
    context.drawImage(images[5], x[itemData.pickaxe], 90, 50, 50);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./images/${req.params.user}.png`, buffer);

    res.type='image/png';
    res.sendFile(path.join(__dirname, `../images/${req.params.user}.png`));
})

router.get('/:user/source', async (req, res) => {
    const data = await db("SELECT * FROM bridges WHERE player=?", [req.params.user]);
    const itemData = await db("SELECT * FROM bridgesItems where player=?", [req.params.user]);
    if(!itemData && !data) return res.status(404).json({"status":404,"message":"Player not found in database"});

    const mcn = await fetch("https://api.mojang.com/users/profiles/minecraft/" + req.params.user).then(response => response.json());
    return res.render('source', { img: `https://api.plaguecraft.xyz/v0/bridges/${req.params.user}/image`, userName: data.player, points: data.points, uuid: mcn.id })
})

module.exports = router;