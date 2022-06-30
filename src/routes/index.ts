import express from 'express';
import { minigameRouter } from './minigames';
import { authRoute } from './authRoute';
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

routes.use(minigameRouter);
routes.use(authRoute);
routes.use(realtimeRouter);
routes.use(pluginRoute);