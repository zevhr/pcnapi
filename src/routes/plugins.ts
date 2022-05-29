// @ts-nocheck
import { Router } from 'express';
import config from '../config.json';
import fetch from 'node-fetch';

export const pluginRoute = Router();

pluginRoute.get('/plugins/:plugin', (req, res) => {
    const set = new Set(["bridges","tntrun","proxyif"])
    if (set.has(req.params.plugin)) {
        fetch("https://api.github.com/repos/plaguecraft-team/" + req.params.plugin.toLowerCase() + "/releases/latest", {
            method: 'get',
            headers: {
                'authorization': 'token ' + config.github
            }
        }).then(async (response) => {
            const j = await response.json();

            if (response.status === 200) {
                return res.status(200).json({
                    "status": 200,
                    "latest_file": j.assets[0].name,
                    "last_updated": j.assets[0].created_at,
                    "download": j.assets[0].browser_download_url
                })
            } else return res.status(400).json({"status":400,"message":"An unknown error occurred. It's not you, it's us."})
        })
    } else return res.status(404).json({"status":404,"message":"You've queried for an improper plugin.", "expected": set})
})
