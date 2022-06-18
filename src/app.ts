import express from 'express';
import fetch from 'node-fetch';
import config from './config.json';
import { routes } from './routes';

const app = express();
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use('/', routes);
app.get('*', (req, res) => {
    return res.status(404).json({"status":404,"message":"The server cannot access that resource or it is missing. If this resource is intended to exist, please reach out to the app maintainer."});
})

app.listen(config.port, () => {
    fetch(config.webhook, {
        method: 'post',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            "content": "REST API Successfully compiled & started on port " + config.port + "\n" + JSON.stringify({
                "status": "ok",
                "appAuthor": "PlagueCraft Network Team",
                "appDescription": "PlagueCraft REST API",
                "appOwner": "Awex"
            })
        })
    })
})
