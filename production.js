                            ///////////////////////////////
                            //  PLAGUECRAFT NETWORK API  //
                            ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
// This project has been built by me as a part of the PlagueCraft Network Web Force. //
// It is licensed under the MIT Open-Source License. Check out LICENSE to read more. //
//                        The PlagueCraft Network, 2020-2021                         //
///////////////////////////////////////////////////////////////////////////////////////

// Define packages
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const fs = require('fs');
const favicon = require('serve-favicon');
const https = require('https');
const http = require('http');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const util = require('minecraft-server-util');
const querystring = require('querystring');
const pool = require(`./db`);
const minecraftPlayer = require('minecraft-player');

// Define the express app
const app = express();

// Tell the app what to use
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('combined'))
app.set('pool', pool)

// Handle any errors
process.on('uncaughtException', (error) => {
    console.log('Something broke!\n ERROR: ', error)
    res.send(JSON.stringify({"status": "200 OK", "error": "404 NOT FOUND", "message": "The requested resource was not found. If you expected something to be here, contact the owner of the application (PCN)"}));
})

// Favicon
app.get('/logo.png', (req, res) => res.status(204));
app.use(favicon(('logo.png')))

// Rate Limiting
const rate = rateLimit({                                                                                              
    windowMs: 60 * 60 * 1000, // 1 hour window                                                                      
    max: 100, // start blocking after 100 requests                                                                   
    message:                                                                                                         
      {"status": "429 TOO MANY REQUESTS", "message": "You have been rate limited."}          
  });

  app.use(rate);

  app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

///////////////////
//   ENDPOINTS   //
///////////////////

// / endpoint
app.get('/', (req, res) => {
    res.send(JSON.stringify({"status": "OK", "author": "PCN Web Force", "api-version": "v1", "Runtime-Mode": "productionMode", "application-version": "1.0.8", "application-name": "plaguecraftnetwork.public.restlet.not-keyed"}))
});

// v0 Endpoint
app.get('/v1',(req, res) => {
    res.send(JSON.stringify({"status": "200 OK", "message": "This is a listing of all of the PlagueCraft Network Developer API endpoints.", "ECONOMY/SMP": "/v1/smp", "SKYWARS": "/v1/sw", "STATUS": "/v1/status"}));
  });

  // List all econ data
  app.get('/v1/smp',(req, res) => {
    const pool = app.get('pool'); 
    let sql = "SELECT * FROM playerbank"; // SQL Query
    let query = pool.query(sql, (err, results) => { // Run the query
      res.send(JSON.stringify({"status": "200 OK", "error": null,  "response": results})); // String the data and display it!
    });
  });

  // List all data by player name
app.get('/v1/smp/user', async (req, res) => {

  const pool = app.get('pool');

  const player = req.query.player;
  
  const { uuid } = await minecraftPlayer(`${player}`); 

    let sql = `SELECT NAME, MONEY FROM playerbank WHERE NAME = '${player}'`;
    let query = pool.query(sql, (err, results) => {
      if(err) {
          res.status(404).send(JSON.stringify({"status": "200 OK", "error": "404 NOT FOUND", "message": "The requested resource was not found. If you expected something to be here, contact the owner of the application (PCN)"}));
        }
      res.send(JSON.stringify({"status": "200 OK", "error": null, "player": `${req.query.player}`, "response": results}));
    });
  });

    // List all data by player name
app.get('/v1/smp/uuid', async (req, res) => {

  const pool = app.get('pool');

  const uuid = req.query.uuid;

    let sql = `SELECT NAME, MONEY FROM playerbank WHERE uuid = '${uuid}'`;
    let query = pool.query(sql, (err, results) => {
      if(err) {
          res.status(404).send(JSON.stringify({"status": "200 OK", "error": "404 NOT FOUND", "message": "The requested resource was not found. If you expected something to be here, contact the owner of the application (PCN)"}));
        }
      res.send(JSON.stringify({"status": "200 OK", "error": null, "player": `${req.query.player}`, "response": results}));
    });
  });

      // List all data by player name
app.get('/v1/smp/limit', async (req, res) => {

  const pool = app.get('pool');

  const limit = req.query.limitby;

    let sql = `SELECT ${limit} FROM playerbank`;
    let query = pool.query(sql, (err, results) => {
      if(err) {
          res.status(404).send(JSON.stringify({"status": "200 OK", "error": "404 NOT FOUND", "message": "The requested resource was not found. If you expected something to be here, contact the owner of the application (PCN)"}));
        }
      res.send(JSON.stringify({results}));
    });
  });

  // Get SMP - Skills data by player name
  app.get(`/v1/smp/skills`, (req, res) => {

    const pool = app.get('pool'); 
    const player = req.query.player;
    const uuid = req.query.uuid;

    let sql = `SELECT * FROM SkillData`;
    let query = pool.query(sql, (err, results) => {
        if(err) {
            res.send(JSON.stringify({"status": "200 OK", "error": "404 NOT FOUND", "message": "The requested resource was not found. If you expected something to be here, contact the owner of the application (PCN)"}));
          }
      res.send(JSON.stringify({"status": "200 OK", "error": null, "response": results}));
    });
  });

    // Get SMP - Skills data by player name
    app.get(`/v1/smp/skills/user`, (req, res) => {

      const pool = app.get('pool'); 
      const player = req.query.player;
      const uuid = req.query.uuid;
  
      let sql = `SELECT * FROM SkillData WHERE NAME = '${player}'`;
      let query = pool.query(sql, (err, results) => {
          if(err) {
              res.send(JSON.stringify({"status": "200 OK", "error": "404 NOT FOUND", "message": "The requested resource was not found. If you expected something to be here, contact the owner of the application (PCN)"}));
            }
        res.send(JSON.stringify({"status": "200 OK", "error": null, "response": results}));
      });
    });

// List all SkyWars data
app.get('/v1/sw',(req, res) => {
    let sql = "SELECT player_id, uuid, player_name, wins, losses, kills, deaths, xp FROM sw_player";
    let query = pool.query(sql, (err, results) => {
        if(err) {
            res.send(JSON.stringify({"status": "200 OK", "error": "404 NOT FOUND", "message": "The requested resource was not found. If you expected something to be here, contact the owner of the application (PCN)"}));
          }
      res.status(404).send(JSON.stringify({"status": "200 OK", "error": null, "response": results}));
    });
  });

    // Get SkyWars data by player name
  app.get(`/v1/sw/user`, (req, res) => {

    const pool = app.get('pool'); 
    const player = req.query.player;
    const uuid = req.query.uuid;

    let sql = `SELECT player_id, uuid, player_name, wins, losses, kills, deaths, xp FROM sw_player WHERE player_name = '${player}'`;
    let query = pool.query(sql, (err, results) => {
        if(err) {
            res.send(JSON.stringify({"status": "200 OK", "error": "404 NOT FOUND", "message": "The requested resource was not found. If you expected something to be here, contact the owner of the application (PCN)"}));
          }
      res.send(JSON.stringify({"status": "200 OK", "error": null, "response": results}));
    });
  });

     // Get SkyWars data by UUID
     app.get(`/v1/sw/uuid`,(req, res) => {

      const pool = app.get('pool'); 

      const player = req.query.player;
      const uuid = req.query.uuid;

        let sql = `SELECT player_id, uuid, player_name, wins, losses, kills, deaths, xp FROM sw_player WHERE uuid = '${uuid}'`;
        let query = pool.query(sql, (err, results) => {
            if(err) {
                res.status(404).send(JSON.stringify({"status": "200 OK", "error": "404 NOT FOUND", "message": "The requested resource was not found. If you expected something to be here, contact the owner of the application (PCN)"}));
              }
          res.send(JSON.stringify({"status": "200 OK", "error": null, "response": results}));
        });
      });

      app.get(`/v1/status`, (req, res) => {

        util.status('play.plaguecraft.xyz', { enableSRV: true, timeout: 5000, protocolVersion: 47 }) // These are the default options
    .then((response) => {
        console.log(response);
          res.send(JSON.stringify({"status": "200 OK", "error": null, "response": response}));
    })
    .catch((error) => {
        console.error(error);
    });
        });

            /////////////////////////
            //  HTTP SERVER START  //
            /////////////////////////

 const httpServer = http.createServer(app);

  httpServer.listen(1337, () => {
    console.log('Done!');
  });                                                           
