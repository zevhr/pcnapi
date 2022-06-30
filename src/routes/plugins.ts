// @ts-nocheck
import { Router } from 'express';
import config from '../config.json';
import fetch from 'node-fetch';

export const pluginRoute = Router();

pluginRoute.get('/plugins/:plugin', (req, res) => {
    const set = new Set(["bridges","tntrun","parkour","proxyif"]);
    if (set.has(req.params.plugin)) {
        fetch("https://api.github.com/repos/plaguecraft-team/" + req.params.plugin.toLowerCase() + "/releases/latest", {
            method: 'get',
            headers: {
                'authorization': 'token ' + config.github
            }
        }).then(async (response) => {
            if (response.status === 200) {
                const j = await response.json();
                return res.status(200).json({
                    "status":200,
                    "file": {
                        "latest_version": j.tag_name,
                        "assets_url": j.assets_url,
                        "file_name": j.assets[0].name
                    }
                })
            } else return res.status(500).json({"status":500,"message":"It's not you, it's us. GitHub's API returned an unexpected error."});
        })
    } else return res.status(404).json({"status":404,"message":"An unrecognized plugin was provided"});
})
