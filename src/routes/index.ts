import express from 'express';
import { bridgesRoute } from './bridgesRoute';
import { authRoute } from './authRoute';
import { tntrunRoute } from './tntrunRoute';
import { generalRoute } from './general';
import { realtimeRouter } from './realtime';
import { pluginRoute } from './plugins';

export const routes = express.Router();

routes.use(bridgesRoute);
routes.use(authRoute);
routes.use(generalRoute);
routes.use(tntrunRoute);
routes.use(realtimeRouter);
routes.use(pluginRoute);