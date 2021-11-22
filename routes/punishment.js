const express = require('express');
const fetch = require('node-fetch');
const { Client, Pool } = require('pg');
const config = require('../config.json');
const router = express.Router();

const pool = new Pool({
    user: config.databases.usernames.bansdatabase_username,
    password: config.databases.passwords.bansdatabase_password,
    host: '192.168.1.16',
    port: '5432',
    database: 'bans',
});

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
            var { uuid } = await fetch(`https://api.ashcon.app/mojang/v2/user/${req.params.user}`).then(response => response.json());
            pool.query(`SELECT * FROM litebans_kicks WHERE uuid='${uuid}'`, (err, result) => {
                if(err) {
                    console.log(error)
                    return res.status(500).send({ "status": 500, "message": "Something internally went wrong. Let the developers (Awex) know." })
                } else if (!result.rows[0]) {
                    return res.status(404).send({ "status": 404, "message": "User has not been kicked before."})
                } else {
                    return res.send({
                        "uuid": result.rows[0].uuid,
                        "reason": result.rows[0].reason,
                        "kickedBy": result.rows[0].banned_by_name,
                        "until": result.rows[0].until
                     })
                }
            })
        } else if (type === 'bans') {
            var { uuid } = await fetch(`https://api.ashcon.app/mojang/v2/user/${req.params.user}`).then(response => response.json());
            pool.query(`SELECT * FROM litebans_bans WHERE uuid='${uuid}'`, (err, result) => {
                if(err) {
                    console.log(err)
                    return res.status(500).send({ "status": 500, "message": "Something internally went wrong. Let the developers (Awex) know." })
                } else if (!result.rows[0]) {
                    return res.status(404).send({ "status": 404, "message": "User has not been banned before."})
                } else {
                    return res.send({
                        "uuid": result.rows[0].uuid,
                        "reason": result.rows[0].reason,
                        "kickedBy": result.rows[0].banned_by_name,
                        "until": result.rows[0].until
                     })
                }
            })
        } else if (type === 'warns') {
            try {
                var { uuid } = await fetch(`https://api.ashcon.app/mojang/v2/user/${req.params.user}`).then(response => response.json());
                pool.query(`SELECT * FROM litebans_warnings WHERE uuid='${uuid}'`, (err, result) => {
                    if(err) {
                        console.log(err)
                        return res.status(500).send({ "status": 500, "message": "Something internally went wrong. Let the developers (Awex) know." })
                    } else if (!result.rows[0]) {
                        return res.status(404).send({ "status": 404, "message": "User has not been warned before."})
                    } else {
                        return res.send({
                            "uuid": result.rows[0].uuid,
                            "reason": result.rows[0].reason,
                            "kickedBy": result.rows[0].banned_by_name,
                            "until": result.rows[0].until
                         })
                    }
                })
            } catch (err) {
                console.log(err)
                return res.status(500).send({ "status": 500, "message": "Something internally went wrong. Let the developers (Awex) know."})
            }
        } else if (type === 'mutes') {
            var { uuid } = await fetch(`https://api.ashcon.app/mojang/v2/user/${req.params.user}`).then(response => response.json());
            pool.query(`SELECT * FROM litebans_mutes WHERE uuid='${uuid}'`, (err, result) => {
                if(err) {
                    console.log(err)
                    return res.status(500).send({ "status": 500, "message": "Something internally went wrong. Let the developers (Awex) know." })
                } else if (!result.rows[0]) {
                    return res.status(404).send({ "status": 404, "message": "User has not been muted before."})
                } else {
                    return res.send({
                        "uuid": result.rows[0].uuid,
                        "reason": result.rows[0].reason,
                        "kickedBy": result.rows[0].banned_by_name,
                        "until": result.rows[0].until
                     })
                }
            })
        }
    }
})

module.exports = router;