import express from 'express';
import * as routes from './routes';

const app = express();
routes.register(app);

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.listen(3000, () => {
    // console.warn('Example app listening on port 3000!');
})
