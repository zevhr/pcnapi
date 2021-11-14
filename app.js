                            ///////////////////////////////
                            //  PLAGUECRAFT NETWORK API  //
                            ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
// This project has been built by me as a part of the PlagueCraft Network Web Force. //
// It is licensed under the MIT Open-Source License. Check out LICENSE to read more. //
//                        The PlagueCraft Network, 2020-2021                         //
///////////////////////////////////////////////////////////////////////////////////////
 
// Defining packages required for this app
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const rate = rateLimit({                                                                                              
  windowMs: 60 * 60 * 1000,                                                                  
  max: 100,                                                                
  message:                                                                                                         
    {"status": 429, "message": "You have been rate limited."}          
});

// Spinning up an express app
const app = express();

// App.use statements
app.use(express.json());
app.use(cors());
app.use(morgan('combined'))
app.use(rate);

///////////////////
//   ENDPOINTS   //
///////////////////

const skywarsEp = require('./routes/skw');
const punishmentEp = require('./routes/punishment');

app.use('/v0/punishment/', punishmentEp);
app.use('/v0/skywars/', skywarsEp)

/////////////////////////
//  HTTP SERVER START  //
/////////////////////////

app.listen(1337, () => {
  console.log(`Done! Started on port 1337.`)
})   