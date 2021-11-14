const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const { bansPool } = require('../js-modules/db');

router.get('/:user/:type', async (req, res) => {
    const type = req.params.type
    var valid_types = new Set(['bans', 'mutes', 'kicks', 'warns'])

    if(!valid_types.has(type)) {
        return res.status(400).send({ 
        "status": 400, 
        "message": "An incorrect punishment type was provided.", 
        "accepted_values": [
            "bans",
            "mutes",
            "kicks",
            "warns"
        ]})
    } else {
        if(type === `kicks`) {
            try {
                var { uuid } = await fetch(`https://api.ashcon.app/mojang/v2/user/${req.params.user}`).then(response => response.json());

                if(!uuid) {
                    return res.status(404).send({ "status": 404, "message": "That user doesn't exist on Minecraft." })
                }

                bansPool.query(`SELECT * FROM litebans_kicks WHERE uuid=?`, uuid, async (error, row) => {
                    if(error) {
                        console.log(error)
                        return res.status(500).send({ "status": 500, "message": "Something internally went wrong. Let the developers (Awex) know." })
                    } else {
                        var data = row[Object.keys(row).sort().pop()];

                        if(!data) {
                            return res.status(404).send({ "status": 404, "message": "User has not been kicked before."})
                        } else {
                            return res.send({
                                "uuid": uuid,
                                "reason": data.reason,
                                "kickedBy": data.banned_by_name,
                                "until": data.until
                             })
                        }
                    }
                })
            } catch (err) {
                console.log(err)
                return res.status(500).send({ "status": 500, "message": "Something internally went wrong. Let the developers (Awex) know."})
            }
        } else if (type === 'bans') {
            try {
                var { uuid } = await fetch(`https://api.ashcon.app/mojang/v2/user/${req.params.user}`).then(response => response.json());

                if(!uuid) {
                    return res.status(404).send({ "status": 404, "message": "That user doesn't exist on Minecraft." })
                }

                bansPool.query(`SELECT * FROM litebans_bans WHERE uuid=?`, uuid, async (error, row) => {
                    if(error) {
                        console.log(error)
                        return res.status(500).send({ "status": 500, "message": "Something internally went wrong. Let the developers (Awex) know." })
                    } else {
                        var data = row[Object.keys(row).sort().pop()];

                        if(!data) {
                            return res.status(404).send({ "status": 404, "message": "User has not been banned before."})
                        } else {
                            return res.send({
                                "uuid": uuid,
                                "reason": data.reason,
                                "bannedBy": data.banned_by_name,
                                "until": data.until
                             })
                        }
                    }
                })
            } catch (err) {
                console.log(err)
                return res.status(500).send({ "status": 500, "message": "Something internally went wrong. Let the developers (Awex) know."})
            }
        } else if (type === 'warns') {
            try {
                var { uuid } = await fetch(`https://api.ashcon.app/mojang/v2/user/${req.params.user}`).then(response => response.json());

                if(!uuid) {
                    return res.status(404).send({ "status": 404, "message": "That user doesn't exist on Minecraft." })
                }

                bansPool.query(`SELECT * FROM litebans_warnings WHERE uuid=?`, uuid, async (error, row) => {
                    if(error) {
                        console.log(error)
                        return res.status(500).send({ "status": 500, "message": "Something internally went wrong. Let the developers (Awex) know." })
                    } else {
                        var data = row[Object.keys(row).sort().pop()];

                        if(!data) {
                            return res.status(404).send({ "status": 404, "message": "User has not been warned before."})
                        } else {
                            return res.send({
                                "uuid": uuid,
                                "reason": data.reason,
                                "warnedBy": data.banned_by_name,
                                "until": data.until
                             })
                        }
                    }
                })
            } catch (err) {
                console.log(err)
                return res.status(500).send({ "status": 500, "message": "Something internally went wrong. Let the developers (Awex) know."})
            }
        } else if (type === 'mutes') {
            try {
                var { uuid } = await fetch(`https://api.ashcon.app/mojang/v2/user/${req.params.user}`).then(response => response.json());

                if(!uuid) {
                    return res.status(404).send({ "status": 404, "message": "That user doesn't exist on Minecraft." })
                }

                bansPool.query(`SELECT * FROM litebans_mutes WHERE uuid=?`, uuid, async (error, row) => {
                    if(error) {
                        console.log(error)
                        return res.status(500).send({ "status": 500, "message": "Something internally went wrong. Let the developers (Awex) know." })
                    } else {
                        var data = row[Object.keys(row).sort().pop()];

                        if(!data) {
                            return res.status(404).send({ "status": 404, "message": "User has not been muted before."})
                        } else {
                            return res.send({
                                "uuid": uuid,
                                "reason": data.reason,
                                "mutedBy": data.banned_by_name,
                                "until": data.until
                             })
                        }
                    }
                })
            } catch (err) {
                console.log(err)
                return res.status(500).send({ "status": 500, "message": "Something internally went wrong. Let the developers (Awex) know."})
            }
        }
    }
})

module.exports = router;