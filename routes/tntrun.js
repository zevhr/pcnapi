const express = require('express');
const router = express.Router();
const db = require('../modules/db');

router.get('/:user', async (req, res) => {
    if(!req.params.user) return res.status(404).json({"status": 404,"message":"Player parameter missing"});
    const data = await db("SELECT * FROM tntrun WHERE player=?", [req.params.user]);

    if(!data) return res.status(404).json({"status":404,"message":"Player not found in database"});
    else return res.status(200).json({"status":200,"data": {"name": data.player, "points": data.points}});
})

module.exports = router;