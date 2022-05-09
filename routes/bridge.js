const express = require('express');
const router = express.Router();
const db = require('../modules/db');

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

module.exports = router;