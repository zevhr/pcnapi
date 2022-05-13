const express = require('express');
const db = require('../modules/db');
const router = express.Router();

router.get('/:user', async (req, res) => {
    const playerPoints = await getAllPlayerPoints(req.params.user);

    if(!playerPoints) return res.status(404).json({"status":404,"message":"Player not found in database"});
    else {
        return res.status(200).json({"status":200,data:{name: req.params.user.toLowerCase(), totalPoints: playerPoints }});
    }
})

module.exports = router;

async function getAllPlayerPoints(name) {
    const getBridges = await db("SELECT * FROM bridges WHERE player=?", [name]);
    const getTntrun = await db("SELECT * FROM tntrun WHERE player=?", [name]);

    if (!getBridges && !getTntRun) {
        return false;
    } else {
        const countedPoints = Math.round(parseInt(getBridges.points) + parseInt(getTntrun.points));
        return countedPoints
    }
}