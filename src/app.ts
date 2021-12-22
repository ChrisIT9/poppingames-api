import { dbConnect } from "./Connections/db_connect";
import express from 'express';
import loginRouter from "./Routes/Login";
import registerRouter from "./Routes/Register";
import logoutRouter from "./Routes/Logout";
import reviewsRouter from "./Routes/Reviews";
import cors from 'cors';

const data = require('../response.json');
const mc = require('../minecraft.json');
const screenshots = require('../screenshots.json');

dbConnect();

const app = express();
app.use(cors({ origin: "http://192.168.1.200:4200", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/games', (req, res) => {
    return res.json(data);
})

app.get('/games/:id', (req, res) => {
    return res.json(mc);
})

app.get('/games/:id/screenshots', (req, res) => {
    return res.json(screenshots);
})

app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);
app.use('/reviews', reviewsRouter);



app.listen(3001, () => console.log("[EXPRESS] Server up on port 3001."));