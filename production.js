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
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');

// Define the express app
const app = express();

// Tell the app what to use
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('combined'))
app.set('pool', pool)
// dotenv.config();
// process.env.TOKEN_SECRET

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
    res.send(JSON.stringify({"status": "OK", "author": "PCN Web Force", "api-version": "v1", "Runtime-Mode": "productionMode", "application-version": "1.0.6", "application-name": "plaguecraftnetwork.public.restlet.not-keyed"}))
});

// v0 Endpoint
app.get('/v1',(req, res) => {
    res.send(JSON.stringify({"status": "200 OK", "message": "This is a listing of all of the PlagueCraft Network Developer API endpoints.", "ECONOMY/SMP": "/v1/smp", "SKYWARS": "/v1/sw", "STATUS": "/v1/status", "EXTERNAL-STATUS": "/v1/extstat"}));
  });

  // List all econ data
  app.get('/v1/smp',(req, res) => {
    const pool = app.get('pool'); 
    let sql = "SELECT uuid, balance FROM econ_BALANCES"; // SQL Query
    let query = pool.query(sql, (err, results) => { // Run the query
      res.send(JSON.stringify({"status": "200 OK", "error": null,  "response": results})); // String the data and display it!
    });
  });

  // List all data by player name
app.get('/v1/smp/user', async (req, res) => {

  const pool = app.get('pool');

  const player = req.query.player;
  
  const { uuid } = await minecraftPlayer(`${player}`); 

    let sql = `SELECT uuid, balance FROM econ_BALANCES WHERE uuid = '${uuid}'`;
    let query = pool.query(sql, (err, results) => {
      if(err) {
          res.status(404).send(JSON.stringify({"status": "200 OK", "error": "404 NOT FOUND", "message": "The requested resource was not found. If you expected something to be here, contact the owner of the application (PCN)"}));
        }
      res.send(JSON.stringify({"status": "200 OK", "error": null, "player": `${req.query.player}`, "response": results}));
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

    //     app.get(`/v1/extstat`, (req, res) => {
          
    //       const ip = req.query.ip;
    //       const port = Number(`${req.query.port}`)

    //       util.status(`${ip}`, { port: port, enableSRV: req.query.srv, timeout: 5000, protocolVersion: 47 }) // These are the default options
    // .then((response) => {
    //     console.log(response);
    //       res.send(JSON.stringify({"status": "200 OK", "error": null, "response": response}));
    // })
    // .catch((error) => {
    //   res.send(JSON.stringify({"status": "200 OK", "error": 404, "response": "The server you requested is either offline or not found."}));
    // });
    //     })

        /////////////////////////
        //   ACCOUNT SYSTEM    //
        /////////////////////////

        // function generateAccessToken(username) {
        //   return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
        // }

        // app.post('/v1/create', (req, res) => {
        //   // ...
        
        //   const token = generateAccessToken({ username: req.body.username });
        //   res.json(token);
        
        //   // ...
        // });









            /////////////////////////
            //  HTTP SERVER START  //
            /////////////////////////

 const httpServer = http.createServer(app);

//  const httpsServer = https.createServer({                                                                             
//     key: fs.readFileSync('/etc/letsencrypt/live/api.plaguecraft.xyz/privkey.pem'),                                     
//     cert: fs.readFileSync('/etc/letsencrypt/live/api.plaguecraft.xyz/fullchain.pem')                                   
//   }, app);

  httpServer.listen(80, () => {
  });

// Log the server enable
//  httpsServer.listen(443, () => {                                                                                      
//     console.log('Production API now running on port 443');                                                             
//     console.log(`PCNAPI -- Production Mode Online.`);  
//  });                                                             
