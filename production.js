///////////////////////////////
//  PLAGUECRAFT NETWORK API  //
///////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
// This project has been built by me as a part of the PlagueCraft Network Web Force. //
// It is licensed under the MIT Open-Source License. Check out LICENSE to read more. //
// The PlagueCraft Network, 2020-2021                                                //
///////////////////////////////////////////////////////////////////////////////////////

// Defining modules
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const fs = require('fs');
const favicon = require('serve-favicon');
const https = require('https');
const http = require('http');
const morgan = require('morgan')
const rateLimit = require('express-rate-limit');
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'))

// Error Handler
process.on('uncaughtException', (error)  => {
    console.log('Oh my god, something terrible happened: ',  error);
})

// Favicon Definition
app.get('/logo.png', (req, res) => res.status(204));
app.use(favicon(('logo.png')))

// Creating the SQL Pool
const pool = mysql.createPool({
  connectionLimit : 10,
  host            : '',
  user            : '',
  password        : '',
  database        : ''
});

const req = rateLimit({                                                                                              
  windowMs: 60 * 60 * 1000, // 1 hour window                                                                      
  max: 100, // start blocking after 100 requests                                                                   
  message:                                                                                                         
    {"status": "429 TOO MANY REQUESTS", "message": "You have been rate limited."}          
});

// / endpoint
app.get('/', (req, res) => {
    res.send(JSON.stringify({"status": "OK", "author": "PCN Web Force", "api-version": "v0", "Runtime-Mode": "developmentMode", "application-version": "1.0.2"}))
})

// v0 Endpoint
app.get('/v0',(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(JSON.stringify({"status": "200 OK", "message": "This is a listing of all of the PlagueCraft Network Developer API endpoints.", "ECONOMY/SMP": "/v0/smp/data", "SKYWARS": "/v0/sw/data"}));
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
app.get('/v0/smp/bal/:id',(req, res) => {
    let sql = `SELECT balance, player FROM xconomy WHERE player = '${req.params.id}'`;
    let query = pool.query(sql, (err, results) => {
        if(err) {
            res.status(404).send(JSON.stringify({"status": "200 OK", "error": "404 NOT FOUND", "message": "The requested resource was not found. If you expected something to be here, contact the owner of the application (PCN)"}));
          }
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(JSON.stringify({results}));
    });
  });

// List all data by player
app.get('/v0/smp/:id',(req, res) => {
  let sql = `SELECT * FROM xconomy WHERE player = '${req.params.id}'`;
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
  app.get(`/v0/sw/:id`,(req, res) => {
    let sql = `SELECT * FROM sw_player WHERE player_name = '${req.params.id}'`;
    let query = pool.query(sql, (err, results) => {
        if(err) {
            res.status(404).send(JSON.stringify({"status": "200 OK", "error": "404 NOT FOUND", "message": "The requested resource was not found. If you expected something to be here, contact the owner of the application (PCN)"}));
          }
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(JSON.stringify({"status": "200 OK", "error": null, "response": results}));
    });
  });

  // Spin up a simple Express HTTP server
const httpServer = http.createServer(app);

const httpsServer = https.createServer({                                                                             
  key: fs.readFileSync('/etc/letsencrypt/live/api.plaguecraft.xyz/privkey.pem'),                                     
  cert: fs.readFileSync('/etc/letsencrypt/live/api.plaguecraft.xyz/fullchain.pem')                                   
}, app); 

// Log Enable
httpServer.listen(80, () => {
});

httpsServer.listen(443, () => {                                                                                      
  console.log('Production API now running on port 443');                                                             
  console.log(`PCNAPI -- Production Mode Online.`);                                                                  
})  

