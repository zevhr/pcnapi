// @ts-nocheck
import express from 'express';
import fetch from 'node-fetch';
import config from './config.json';
import swags from 'swagger-ui-express';
import swagsDoc from './swagger.json';
import { routes } from './routes';
import { redisClient } from './modules/redis';
import { init } from './routes/realtime';

const app = express();
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use('/docs', swags.serve, swags.setup(swagsDoc));
app.use('/', routes);
app.get('*', (req, res) => {
    return res.status(404).json({"status":404,"message":"The server cannot access that resource or it is missing. If this resource is intended to exist, please reach out to the app maintainer."});
})

if (config.debug) {
    app.listen(config.port, () => {
        console.log("Dev API Online")
        init(app);
    })
} else {
    let httpsServer = https.createServer({ cert: config.ssl.cert, key: config.ssl.privkey });

    app.listen(config.port, () => {
        console.log("Dev API Online")
        init(app);
    })
    init(httpsServer);
}
