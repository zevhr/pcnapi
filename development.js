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
app.use(bodyParser.json());
app.use(cors());

// Error Handler
process.on('uncaughtException', (error)  => {
    console.log('Oh my god, something terrible happened: ',  error);
})

// Favicon Definition
/*app.get('/logo.png', (req, res) => res.status(204));
app.use(favicon(('logo.png')))*/

// Creating the SQL Pool
const pool = mysql.createPool({
  connectionLimit : 10,
  host            : '',
  user            : '',
  password        : '',
  database        : ''
});

app.use(morgan('combined'))

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
app.get('/v0/smp/data',(req, res) => {
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
    let sql = "SELECT balance, player FROM xconomy WHERE player="+req.params.id;
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
  let sql = 'SELECT * FROM xconomy WHERE player = ' + req.params.id;
  let query = pool.query(sql, (err, results) => {
    if(err) {
        res.status(404).send(JSON.stringify({"status": "200 OK", "error": "404 NOT FOUND", "message": "The requested resource was not found. If you expected something to be here, contact the owner of the application (PCN)"}));
      }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(JSON.stringify({"status": "200 OK", "error": null, "response": results}));
  });
});

// List all SkyWars data
  app.get('/v0/sw/data',(req, res) => {
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
  app.get('/v0/sw/:id',(req, res) => {
    let sql = "SELECT * FROM sw_player WHERE player_name = "+req.params.id;
    let query = pool.query(sql, (err, results) => {
        if(err) {
            res.status(404).send(JSON.stringify({"status": "200 OK", "error": "404 NOT FOUND", "message": "The requested resource was not found. If you expected something to be here, contact the owner of the application (PCN)"}));
          }
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(JSON.stringify({"status": "200 OK", "error": null, "response": results}));
    });
  });

  app.get('*', function(req, res){
       res.send(JSON.stringify({"status": "200 OK", "error": "404 NOT FOUND", "message": "The requested resource was not found. If you expected something to be here, contact the owner of the application (PCN)"}));
  });

  // Spin up a simple Express HTTP server
const httpServer = http.createServer(app);

// Log Enable
httpServer.listen(8080, () => {
    console.log('Development API now running on port 8080');
    console.log(`PCNAPI -- Development Mode Online.\nTHIS IS NOT TO BE USED IN PRODUCTION.`);
});

