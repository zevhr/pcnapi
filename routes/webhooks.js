const express = require('express');
const fetch = require('node-fetch');
const config = require('../config.json');
const router = express.Router();

router.post('/notion', async (req, res) => {
    if (req.headers['x-hub-signature-256'] != config.tokens.github_auth) {
        return res.status(401).send({"status":403,"message":"Invalid or incorrect SHA signature"});
    } else {
        fetch("https://api.notion.com/v1/pages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + config.tokens.notion,
                "Notion-Version": "2022-02-22"
            },
            body: JSON.stringify({
                "parent": {
                    "type": "database_id",
                    "database_id": "c9b4925d67f44626876cb1bb3e945c64"
                },
                "properties": {
                    "Name": {
                        "title": [
                            {
                                "text": {
                                    "content": req.body.issue.title
                                }
                            }
                        ]
                    },
                    "Type": {
                        "multi_select": [
                            {
                                "name": "Bug"
                            }
                        ]
                    },
                    "Repository": {
                        "url": req.body.repository.html_url
                    },
                    "Sent by" : {
                        "rich_text": [
                            {
                                "text": {
                                    "content": req.body.sender.login
                                }
                            }
                        ]
                    },
                    "Issue URL": {
                        "url": req.body.issue.html_url
                    }
                }
            })
          }).then(async function(response) {
            return res.status(response.status).json({"status": response.status, data: await response.json()})
          }) 
    }
})

module.exports = router;