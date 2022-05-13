                            ///////////////////////////////
                            //  PLAGUECRAFT NETWORK API  //
                            ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
// This project has been built by me as a part of the PlagueCraft Network Web Force. //
// It is licensed under the MIT Open-Source License. Check out LICENSE to read more. //
//                        The PlagueCraft Network, 2020-2022                         //
///////////////////////////////////////////////////////////////////////////////////////
 
// Defining packages required for this app
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const rate = rateLimit({                                                                                              
  windowMs: 60 * 60 * 1000,                                                                  
  max: 100,                                                                
  message:                                                                                                         
    {"status": 429, "message": "You have been rate limited."}          
});

// Spinning up an express app
const app = express();

// App.use statements
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(cors());
app.use(rate);

///////////////////
//   ENDPOINTS   //
///////////////////

app.get('/', (req, res) => {
  return res.status(200).json({"status":200,"message":"PlagueCraft Network REST API"});
});

app.use('/v0/bridges/', require('./routes/bridge'));
app.use('/v0/tntrun/', require('./routes/tntrun'));

app.use('/v0/webhook/', require('./routes/webhooks'));

/////////////////////////
//  HTTP SERVER START  //
/////////////////////////

app.listen(1337, () => {
  console.log(`Done! Started on port 1337.`)
})