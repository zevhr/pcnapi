const rateLimit = require('express-rate-limit');

// Create a rate limiter
const rate = rateLimit({                                                                                              
    windowMs: 60 * 60 * 1000, // 1 hour window                                                                      
    max: 10, // start blocking after 100 requests                                                                   
    message:                                                                                                         
      {"status": "429 TOO MANY REQUESTS", "message": "You have been rate limited."}          
  });

  module.exports = rate; 