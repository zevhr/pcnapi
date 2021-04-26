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

// Define the express app
const app = express();

// Tell the app what to use
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('combined'))

// Handle any errors
process.on('uncaughtException', (error) => {
    console.log('Something broke!\n ERROR: ', error)
})

// Favicon
app.get('/logo.png', (req, res) => res.status(204));
app.use(favicon(('logo.png')))

// Create SQL Connection
const pool = mysql.createPool({
    connectLimit : 10,
    host            : '',
    user            : '',
    password        : '',
    database        : ''
});

// Rate Limiting
const rate = rateLimit({                                                                                              
    windowMs: 60 * 60 * 1000, // 1 hour window                                                                      
    max: 100, // start blocking after 100 requests                                                                   
    message:                                                                                                         
      {"status": "429 TOO MANY REQUESTS", "message": "You have been rate limited."}          
  });

  app.use(rate);

///////////////////
//   ENDPOINTS   //
///////////////////

// / endpoint
app.get('/', (req, res) => {
    res.send(JSON.stringify({"status": "OK", "author": "PCN Web Force", "api-version": "v0", "Runtime-Mode": "productionMode", "application-version": "1.0.2", "application-name": "plaguecraftnetwork.public.restlet.not-keyed"}))
})

// v0 Endpoint
app.get('/v0',(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(JSON.stringify({"status": "200 OK", "message": "This is a listing of all of the PlagueCraft Network Developer API endpoints.", "ECONOMY/SMP": "/v0/smp", "SKYWARS": "/v0/sw", "STATUS": "/v0/status", "EXTERNAL-STATUS": "/v0/extstat"}));
  });

  // List all econ data
  app.get('/v0/smp',(req, res) => {
    let sql = "SELECT * FROM xconomy"; // SQL Query
    let query = pool.query(sql, (err, results) => { // Run the query
      if(err) {
          res.status(404).send(JSON.stringify({"status": "200 OK", "error": "404 NOT FOUND", "message": "The requested resource was not found. If you expected something to be here, contact the owner of the application (PCN)"}));
        } // Send an error message if it can't find what it's looking for
      res.setHeader('Access-Control-Allow-Origin', '*'); // Set HTTP headers
      res.send(JSON.stringify({"status": "200 OK", "error": null, "response": results})); // String the data and display it!
    });
  });

  // List only player name and bal (specifically for the PCN Bot)
app.get('/v0/smp/bal',(req, res) => {

  const player = req.query.player;
  const ip = req.query.ip;
  const uuid = req.query.uuid;


    let sql = `SELECT balance, player FROM xconomy WHERE player = '${req.query.name}'`;
    let query = pool.query(sql, (err, results) => {
        // if(err) {
        //     res.status(404).send(JSON.stringify({"status": "200 OK", "error": "404 NOT FOUND", "message": "The requested resource was not found. If you expected something to be here, contact the owner of the application (PCN)"}));
        //   }
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(JSON.stringify({results}));
    });
  });

  // List all data by player name
app.get('/v0/smp/username',(req, res) => {
  
  const player = req.query.player;
  const ip = req.query.ip;
  const uuid = req.query.uuid;

    let sql = `SELECT * FROM xconomy WHERE player = '${player}'`;
    let query = pool.query(sql, (err, results) => {
      if(err) {
          res.status(404).send(JSON.stringify({"status": "200 OK", "error": "404 NOT FOUND", "message": "The requested resource was not found. If you expected something to be here, contact the owner of the application (PCN)"}));
        }
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(JSON.stringify({"status": "200 OK", "response": results}));
    });
  });

  // List all SMP data by UUID
app.get('/v0/smp/uuid',(req, res) => {

  const player = req.query.player;
  const ip = req.query.ip;
  const uuid = req.query.uuid;

    let sql = `SELECT * FROM xconomy WHERE UID = '${uuid}'`;
    let query = pool.query(sql, (err, results) => {
      if(err) {
          res.status(404).send(JSON.stringify({"status": "200 OK", "error": "404 NOT FOUND", "message": "The requested resource was not found. If you expected something to be here, contact the owner of the application (PCN)"}));
        }
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(JSON.stringify({"status": "200 OK", "error": null, "response": results}));
    });
  });

// List all SkyWars data
app.get('/v0/sw',(req, res) => {
    let sql = "SELECT * FROM sw_player";
    let query = pool.query(sql, (err, results) => {
        if(err) {
            res.send(JSON.stringify({"status": "200 OK", "error": "404 NOT FOUND", "message": "The requested resource was not found. If you expected something to be here, contact the owner of the application (PCN)"}));
          }
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(404).send(JSON.stringify({"status": "200 OK", "error": null, "response": results}));
    });
  });

    // Get SkyWars data by player name
  app.get(`/v0/sw/username`, (req, res) => {

    let player = req.query.player;
    console.log(player)

    let sql = `SELECT * FROM sw_player WHERE player_name = '${player}'`;
    let query = pool.query(sql, (err, results) => {
        if(err) {
            res.send(JSON.stringify({"status": "200 OK", "error": "404 NOT FOUND", "message": "The requested resource was not found. If you expected something to be here, contact the owner of the application (PCN)"}));
          }
      res.send(JSON.stringify({"status": "200 OK", "error": null, "response": results}));
    });
  });

     // Get SkyWars data by UUID
     app.get(`/v0/sw/uuid`,(req, res) => {

      const player = req.query.player;
      const ip = req.query.ip;
      const uuid = req.query.uuid;

        let sql = `SELECT * FROM sw_player WHERE uuid = '${uuid}'`;
        let query = pool.query(sql, (err, results) => {
            if(err) {
                res.status(404).send(JSON.stringify({"status": "200 OK", "error": "404 NOT FOUND", "message": "The requested resource was not found. If you expected something to be here, contact the owner of the application (PCN)"}));
              }
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.send(JSON.stringify({"status": "200 OK", "error": null, "response": results}));
        });
      });

      app.get(`/v0/status`, (req, res) => {

        util.status('play.plaguecraft.xyz', { port: 25577, enableSRV: true, timeout: 5000, protocolVersion: 47 }) // These are the default options
    .then((response) => {
        console.log(response);
        res.setHeader('Access-Control-Allow-Origin', '*');
          res.send(JSON.stringify({"status": "200 OK", "error": null, "response": response}));
    })
    .catch((error) => {
        console.error(error);
    });
        });

        app.get(`/v0/extstat`, (req, res) => {

          const player = req.query.player;
          const ip = req.query.ip;
          const uuid = req.query.uuid;

          util.status(`${ip}`, { enableSRV: true, timeout: 5000, protocolVersion: 47 }) // These are the default options
    .then((response) => {
        console.log(response);
        res.setHeader('Access-Control-Allow-Origin', '*');
          res.send(JSON.stringify({"status": "200 OK", "error": null, "response": response}));
    })
    .catch((error) => {
      res.send(JSON.stringify({"status": "200 OK", "error": 404, "response": "The server you requested is either offline or not found."}));
    });
        })

/////////////////////////
//  HTTP SERVER START  //
/////////////////////////

 const httpServer = http.createServer(app);

 const httpsServer = https.createServer({                                                                             
    key: fs.readFileSync('/etc/letsencrypt/live/api.plaguecraft.xyz/privkey.pem'),                                     
    cert: fs.readFileSync('/etc/letsencrypt/live/api.plaguecraft.xyz/fullchain.pem')                                   
  }, app);

  httpServer.listen(80, () => {
  });

// Log the server enable
 httpsServer.listen(443, () => {                                                                                      
    console.log('Production API now running on port 443');                                                             
    console.log(`PCNAPI -- Production Mode Online.`);  
 });                                                                
