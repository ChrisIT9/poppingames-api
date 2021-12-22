import express from 'express';
import { session } from '../Connections/session';
import { requiresAuth } from '../Controllers/Auth';

const logoutRouter = express.Router();
logoutRouter.use(session);

logoutRouter.post('/', requiresAuth, (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Impossibile distruggere la sessione!" });
    });

    return res.status(200).json({ message: "Hai effettuato la disconnessione." });
})

export default logoutRouter;