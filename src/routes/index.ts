import express from 'express';
import { bridgesRoute } from './bridgesRoute';
import { authRoute } from './authRoute';
import { tntrunRoute } from './tntrunRoute';
import { generalRoute } from './general';
import { realtimeRouter } from './realtime';
import { pluginRoute } from './plugins';

export const routes = express.Router();

routes.get('/', (req, res) => {
    return res.status(200).json({
        "status": 200,
        "appAuthor": "PlagueCraft Network Team",
        "appDescription": "PlagueCraft REST API",
        "appOwner": "Awex"
    })
})

routes.use(bridgesRoute);
routes.use(authRoute);
routes.use(generalRoute);
routes.use(tntrunRoute);
routes.use(realtimeRouter);
routes.use(pluginRoute);