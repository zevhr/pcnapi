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
app.use(bodyParser.json());
app.use(cors());

// Error Handler
process.on('uncaughtException', (error)  => {
    console.log('Oh my god, something terrible happened: ',  error);
})

// Redirect to HTTPS
app.use (function (req, res, next) {
  if (req.secure) {
          next();
  } else {
          res.redirect('https://api.plaguecraft.xyz'+ req.url);
  }
});

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

// / endpoint
app.get('/', (req, res) => {
    res.send(JSON.stringify({"status": "OK", "author": "PCN Web Force", "api-version": "v0"}))
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
    if(err) throw err; // If there's an error, then throw it smh
    res.setHeader('Access-Control-Allow-Origin', '*'); // Set HTTP headers
    res.send(JSON.stringify({"status": "200 OK", "error": null, "response": results})); // String the data and display it!
  });
});

// List only player name and bal (specifically for the PCN Bot)
app.get('/v0/smp/bal/:id',(req, res) => {
    let sql = "SELECT balance, player FROM xconomy WHERE player="+req.params.id;
    let query = pool.query(sql, (err, results) => {
      if(err) throw err;
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(JSON.stringify({results}));
    });
  });

// List all data by player
app.get('/v0/smp/:id',(req, res) => {
  let sql = 'SELECT * FROM xconomy WHERE player = ' + req.params.id;
  let query = pool.query(sql, (err, results) => {
    if(err) throw err;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(JSON.stringify({"status": "200 OK", "error": null, "response": results}));
  });
});

// List all SkyWars data
  app.get('/v0/sw/data',(req, res) => {
    let sql = "SELECT * FROM sw_player";
    let query = pool.query(sql, (err, results) => {
      if(err) throw err;
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(JSON.stringify({"status": "200 OK", "error": null, "response": results}));
    });
  });

  // Get SkyWars data by player name
  app.get('/v0/sw/:id',(req, res) => {
    let sql = "SELECT * FROM sw_player WHERE player_name = "+req.params.id;
    let query = pool.query(sql, (err, results) => {
      if(err) throw err;
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(JSON.stringify({"status": "200 OK", "error": null, "response": results}));
    });
  });

  // Spin up a simple Express HTTP server
const httpServer = http.createServer(app);

// Spin up a HTTPS server w/ HTTPS keys and certs
const httpsServer = https.createServer({
  key: fs.readFileSync(''),
  cert: fs.readFileSync(''),
}, app);

// Log Enable
httpServer.listen(80, () => {
    console.log('HTTP Server now running on port 80');
});

// Log Enable
httpsServer.listen(443, () => {
  console.log('HTTPS Server now running on port 443');
});

