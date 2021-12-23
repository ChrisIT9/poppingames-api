import { dbConnect } from "./Connections/db_connect";
import express from 'express';
import loginRouter from "./Routes/Login";
import registerRouter from "./Routes/Register";
import logoutRouter from "./Routes/Logout";
import reviewsRouter from "./Routes/Reviews";
import cors from 'cors';
import { session } from "./Connections/session";

dbConnect();

const app = express();
app.use(cors({ origin: "http://192.168.1.200:4200", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session);

app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);
app.use('/reviews', reviewsRouter);

app.get('/', (req, res) => {
    return res.status(200).json({ isLoggedIn: req.session.username ? true : false });
})

app.listen(3001, () => console.log("[EXPRESS] Server up on port 3001."));