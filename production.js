                            ///////////////////////////////
                            //  PLAGUECRAFT NETWORK API  //
                            ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
// This project has been built by me as a part of the PlagueCraft Network Web Force. //
// It is licensed under the MIT Open-Source License. Check out LICENSE to read more. //
//                        The PlagueCraft Network, 2020-2021                         //
///////////////////////////////////////////////////////////////////////////////////////
 
// Defining packages required for this app
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const fs = require('fs');
const favicon = require('serve-favicon');
const https = require('https');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const util = require('minecraft-server-util');
const pool = require(`./js-modules/db`);
const rate = require(`./js-modules/ratelimiter`)
const minecraftPlayer = require('minecraft-player');

// Spinning up an express app
const app = express();

// App.use statements
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'))
app.set('pool', pool);
app.set('rate', rate);

// Favicon Definition
app.get('logo.png', (req, res) => res.status(204));
app.use(favicon(('logo.png')));
app.use(rate);

///////////////////
//   ENDPOINTS   //
///////////////////
// No-path endpoint
app.get('/', (req, res) => {
    res.send(JSON.stringify({"status": "OK", "author": "PCN Web Force", "api-version": "v2", "Runtime-Mode": "productionMode", "application-version": "stable-2.0.1", "application-name": "plaguecraftnetwork.public.restlet.not-keyed"}))
});

// v2 Endpoint
app.get('/v2',(req, res) => {
    res.send(JSON.stringify({"status": "200 OK", "message": "This is a listing of all of the PlagueCraft Network Developer API endpoints.", "ECONOMY/SMP": "/v2/smp/econ", "SKILLS/SMP": "/v2/smp/skills", "SKYWARS": "/v2/sw", "STATUS": "/v2/status"}));
  });

  // Economy Endpoint
  app.get('/v2/smp/econ', async (req, res) => {
    const player = req.query.player;
    if(player) {
      const pool = app.get('pool');
      const player = req.query.player;
      const { uuid } = await minecraftPlayer(`${player}`); 
      try {
        let sql = `SELECT uuid, balance FROM TNE_BALANCES WHERE uuid = '${uuid}'`; // SQL Query
        let query = pool.query(sql, (err, results) => { // Run the query
          res.send(JSON.stringify({"status": "200 OK", "error": null,  "response": results})); // String the data and display it!
        });
      }
      catch (error) {
        res.status(404).send(JSON.stringify({"status": 404, "message": "You've hit a 404! Please try again later or contact the PCN Web Force if you think this is inaccurate."}))
        }
    } else if (!player) {
      const pool = app.get('pool');
      try {
        let sql = `SELECT uuid, balance FROM TNE_BALANCES`; // SQL Query
        let query = pool.query(sql, (err, results) => { // Run the query
          res.send(JSON.stringify({"status": "200 OK", "error": null,  "response": results})); // String the data and display it!
        });
      }
      catch (error) {
        res.status(404).send(JSON.stringify({"status": 404, "message": "You've hit a 404! Please try again later or contact the PCN Web Force if you think this is inaccurate."}))
        }
    }
  });

    // Skills endpoint
  app.get('/v2/smp/skills', async (req, res) => {
    const player = req.query.player
    if(player) {
      const pool = app.get('pool');
      try { 
        let sql = `SELECT * FROM SkillData WHERE NAME = '${player}'`;
        let query = pool.query(sql, (err, results) => {
        res.send(JSON.stringify({"status": "200 OK", "error": null, "response": results}));
    });
      }
      catch (error) {
        res.status(404).send(JSON.stringify({"status": 404, "message": "You've hit a 404! Please try again later or contact the PCN Web Force if you think this is inaccurate."}))
      }
    } else if (!player) {
      const pool = app.get('pool');
      try { 
        let sql = `SELECT * FROM SkillData`;
        let query = pool.query(sql, (err, results) => {
        res.send(JSON.stringify({"status": "200 OK", "error": null, "response": results}));
    });
      }
      catch (error) {
        res.status(404).send(JSON.stringify({"status": 404, "message": "You've hit a 404! Please try again later or contact the PCN Web Force if you think this is inaccurate."}))
      }
    }
  })

    // SkyWars Endpoint
  app.get('/v2/pvp/sw', async (req, res) => {
    const player = req.query.player;
    if(player) {
      const pool = app.get('pool');
      try {
        let sql = `SELECT player_id, uuid, player_name, wins, losses, kills, deaths, xp FROM sw_player WHERE player_name = '${player}'`;
        let query = pool.query(sql, (err, results) => {
        res.send(JSON.stringify({"status": "200 OK", "error": null, "response": results}));
    });
      }
      catch (error) {
        res.status(404).send(JSON.stringify({"status": 404, "message": "You've hit a 404! Please try again later or contact the PCN Web Force if you think this is inaccurate."}))
      }
    } else if (!player) {
      const pool = app.get('pool');
      try {
        let sql = "SELECT player_id, uuid, player_name, wins, losses, kills, deaths, xp FROM sw_player";
        let query = pool.query(sql, (err, results) => {
        res.send(JSON.stringify({"status": "200 OK", "error": null, "response": results}));
    });
      }
      catch (error) {
        res.status(404).send(JSON.stringify({"status": 404, "message": "You've hit a 404! Please try again later or contact the PCN Web Force if you think this is inaccurate."}))
      }
    }
  })

      // SkyWars Endpoint
      app.get('/v2/pvp/bridges', async (req, res) => {
        const player = req.query.player;
        if(player) {
          const pool = app.get('pool');
          try {
            let sql = `SELECT * FROM thebridge_stats WHERE name = '${player}'`;
            let query = pool.query(sql, (err, results) => {
            res.send(JSON.stringify({"status": "200 OK", "error": null, "response": results}));
        });
          }
          catch (error) {
            res.status(404).send(JSON.stringify({"status": 404, "message": "You've hit a 404! Please try again later or contact the PCN Web Force if you think this is inaccurate."}))
          }
        } else if (!player) {
          const pool = app.get('pool');
          try {
            let sql = "SELECT * FROM thebridge_stats";
            let query = pool.query(sql, (err, results) => {
            res.send(JSON.stringify({"status": "200 OK", "error": null, "response": results}));
        });
          }
          catch (error) {
            res.status(404).send(JSON.stringify({"status": 404, "message": "You've hit a 404! Please try again later or contact the PCN Web Force if you think this is inaccurate."}))
          }
        }
      })

    // Status Endpoint
  app.get(`/v2/status`, (req, res) => {

        util.status('play.plaguecraft.xyz', { enableSRV: true, timeout: 5000, protocolVersion: 47 }) // These are the default options
    .then((response) => {
        console.log(response);
        res.send(JSON.stringify({"status": "200 OK", "error": null, "response": response}));
    })
    .catch((error, res) => {
        console.error(error);
        res.status(404).send(JSON.stringify({"status": 404, "message": "You've hit a 404! Please try again later or contact the PCN Web Force if you think this is inaccurate."}))
    });
        });

                //The 404 Route (ALWAYS Keep this as the last route)
                app.get('*', function(req, res){
                    res.status(404).send(JSON.stringify({"status:": 404, "response": "404 Not Found error. Please try again later or contact the PCN Web Force (webforce@plaguecraft.xyz)."}));
                  });

            /////////////////////////
            //  HTTP SERVER START  //
            /////////////////////////

const httpServer = http.createServer(app);

httpServer.listen(1337, () => {
  console.log('Done!');
});   