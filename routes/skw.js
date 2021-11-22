const express = require('express');
const router = express.Router();

const { swPool } = require('../js-modules/db');

router.get('/:user', (req, res) => {
    const user = req.params.user;

    try {
        swPool.query('SELECT * FROM sw_player WHERE player_name=?', user, (error, row) => {
            var data = JSON.parse(JSON.stringify(row[0]));
            if(error) {
                console.log(error)
                return res.status(500).send({ "status": 500, "message": "Something internally went wrong. Let the developers (Awex) know."})
            } else if(!data) {
                return res.status(404).send({ "status": 404, "message": "That user has never played before."})
            } else {
                return res.status(200).send({ 
                    "player_name": user,
                    "wins": data.wins,
                    "losses": data.losses,
                    "kills": data.kills,
                    "deaths": data.deaths,
                    "xp": data.xp 
                })
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ "status": 500, "message": "Something internally went wrong. Let the developers (Awex) know."})
    }
})

module.exports = router;