import express from 'express';
import path from 'path';
import fs from 'fs';
import { query } from '../modules/db';
import fetch from 'node-fetch';
import { createCanvas, loadImage } from 'canvas';

// Canvas Config
const width = 728
const height = 159
const canvas = createCanvas(width, height)
const context = canvas.getContext('2d')

interface User {
    "bridges": {
        "player": {
            "username": string,
            "kills": number,
            "points": number
        },
        "itemData": {
            "sword": number,
            "bow": number,
            "concrete1": number,
            "concrete2": number,
            "gap": number,
            "pickaxe": number

        }
    },
    "tntrun": {
        "player": {
            "username": string,
            "points": string,
        }
    }
}

export const register = (app: express.Application) => {
    app.get('/games/:username', async (req, res) => {
        const data = await query("SELECT * FROM bridges WHERE player=?", [req.params.username]);
        const itemData = await query("SELECT * FROM bridgesItems where player=?", [req.params.username]);
        const tdata = await query("SELECT * FROM tntrun WHERE player=?", [req.params.username]);

        const user: User = {
            "bridges": {
                "player": {
                    "username": data.player,
                    "kills": data.kills,
                    "points": data.points
                },
                "itemData": {
                    "sword": itemData.sword,
                    "bow": itemData.bow,
                    "concrete1": itemData.concrete1,
                    "concrete2": itemData.concrete2,
                    "gap": itemData.gap,
                    "pickaxe": itemData.pickaxe
                }
            },
            "tntrun": {
                "player": {
                    "username": tdata.player,
                    "points": tdata.points
                }
            }
        }

        return res.status(200).json({"status":200,user});
    })

    // app.get('/games/:username/image', (req, res) => {
    //     generateImage(req, res);
    // })

    // async function generateImage(req: any, res: any) {
    //     const itemData = await query("SELECT * FROM bridgesItems where player=?", [req.params.username]);
    //     if(!itemData) return res.status(404).json({"status":404,"message":"Player not found in database"});

    //     const images = [];
    //     images.push(await loadImage(path.resolve(__dirname, '../images/hotbar.png')));
    //     images.push(await loadImage(path.resolve(__dirname, '../images/item_images/sword.png')));
    //     images.push(await loadImage(path.resolve(__dirname, '../images/item_images/concrete.png')));
    //     images.push(await loadImage(path.resolve(__dirname, '../images/item_images/bow.png')));
    //     images.push(await loadImage(path.resolve(__dirname, '../images/item_images/gap.png')));
    //     images.push(await loadImage(path.resolve(__dirname, '../images/item_images/pickaxe.png')));

    //     // Hotbar
    //     context.drawImage(images[0], 0, 0, width, height);

    //     interface Positions {
    //         [key: string]: number;
    //     }

    //     const x: Positions = {
    //         "0": 28,
    //         "1": 105,
    //         "2": 182,
    //         "3": 259,
    //         "4": 338,
    //         "5": 415,
    //         "6": 494
    //     }

    //     // Sword
    //     context.drawImage(images[1], x[itemData.sword], 92, 50, 50);

    //     // Concrete 1
    //     context.drawImage(images[2], x[itemData.concrete1], 92, 50, 50);

    //     // Concrete 2
    //     context.drawImage(images[2], x[itemData.concrete2], 92, 50, 50);

    //     // Bow
    //     context.drawImage(images[3], x[itemData.bow], 92, 50, 50);

    //     // Gapple
    //     context.drawImage(images[4], x[itemData.gap], 92, 50, 50);

    //     // Pickaxe
    //     context.drawImage(images[5], x[itemData.pickaxe], 92, 50, 50);

    //     const buffer = canvas.toBuffer('image/png');
    //     fs.writeFileSync(`./images/${req.params.username.toLowerCase()}.png`, buffer);

    //     res.type='image/png';
    //     res.sendFile(path.join(__dirname, `../images/${req.params.username.toLowerCase()}.png`));
    // }
}

// // Canvas Config
// const width = 728
// const height = 159
// const canvas = createCanvas(width, height)
// const context = canvas.getContext('2d')

// const router = express.Router();

// router.get('/games/:username/:game', async (req, res) => {
//     const data = await query("SELECT * FROM bridges WHERE player=?", [req.params.username]);
//     const itemData = await query("SELECT * FROM bridgesItems where player=?", [req.params.username]);

//     if(!data) return res.status(404).json({"status":404,"message":"Player not found in database"});
//     else {
//         interface User {
//             "player": {
//                 "username": string,
//                 "kills": number,
//                 "points": number
//             },
//             "itemData": {
//                 "sword": number | null,
//                 "concrete1": number | null,
//                 "concrete2": number | null,
//                 "bow": number | null,
//                 "gap": number | null,
//                 "pickaxe": number | null
//             }
//         }

//         const user: User = {
//             "player": {
//                 "username": data.player,
//                 "kills": data.kills,
//                 "points": data.points
//             },
//             "itemData": {
//                 "sword": itemData.sword,
//                 "concrete1": itemData.concrete1,
//                 "concrete2": itemData.concrete2,
//                 "bow": itemData.bow,
//                 "gap": itemData.gap,
//                 "pickaxe": itemData.pickaxe
//             }
//         }

//         return res.status(200).json({"status":200,user});
//     }
// })

// router.get('/games/:username/image', (req, res) => {
//     generateImage(req, res);
// })

// async function generateImage(req: any, res: any) {
//     const itemData = await query("SELECT * FROM bridgesItems where player=?", [req.params.username]);
//     if (!itemData) return res.status(404).json({"status":404,"message":"User not found in database"});

//     const images = [];
//     images.push(await loadImage(path.resolve(__dirname, '../images/hotbar.png')));
//     images.push(await loadImage(path.resolve(__dirname, '../images/item_images/sword.png')));
//     images.push(await loadImage(path.resolve(__dirname, '../images/item_images/concrete.png')));
//     images.push(await loadImage(path.resolve(__dirname, '../images/item_images/bow.png')));
//     images.push(await loadImage(path.resolve(__dirname, '../images/item_images/gap.png')));
//     images.push(await loadImage(path.resolve(__dirname, '../images/item_images/pickaxe.png')));

//     // Hotbar
//     context.drawImage(images[0], 0, 0, width, height);

//     interface Positions {
//         [key: string]: number;
//     }

//     const x: Positions = {
//         "0": 28,
//         "1": 105,
//         "2": 182,
//         "3": 259,
//         "4": 338,
//         "5": 415,
//         "6": 494
//     }

//     // Sword
//     context.drawImage(images[1], x[itemData.sword], 92, 50, 50);

//     // Concrete 1
//     context.drawImage(images[2], x[itemData.concrete1], 92, 50, 50);

//     // Concrete 2
//     context.drawImage(images[2], x[itemData.concrete2], 92, 50, 50);

//     // Bow
//     context.drawImage(images[3], x[itemData.bow], 92, 50, 50);

//     // Gapple
//     context.drawImage(images[4], x[itemData.gap], 92, 50, 50);

//     // Pickaxe
//     context.drawImage(images[5], x[itemData.pickaxe], 92, 50, 50);

//     const buffer = canvas.toBuffer('image/png');
//     fs.writeFileSync(`./images/${req.params.user.toLowerCase()}.png`, buffer);

//     res.type='image/png';
//     res.sendFile(path.join(__dirname, `../images/${req.params.user.toLowerCase()}.png`));
// }

// export = router;