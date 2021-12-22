import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { User } from '../Models/User.model';
import { session } from '../Connections/session';
import { isAlreadyLoggedIn } from '../Controllers/Auth';

const loginRouter = express.Router();
loginRouter.use(session);

loginRouter.post(
    '/', 
    isAlreadyLoggedIn,
    body('username').exists().withMessage("Username non valido!"),
    body('password').exists().withMessage("Password non valida!"),
    async (req: Request<{}, {}, { username: string, password: string }>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array().map(item => item.msg) });
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) return res.status(400).json({ message: "Utente non trovato!" });
            const passwordsMatch = await bcrypt.compare(password, user.password);
            if (!passwordsMatch) return res.status(400).json({ message: "Le password non corrispondono!" });
            req.session.username = username;
            req.session.isAdmin = user.isAdmin;
            req.session.userId = user._id;
            return res.status(200).json({ message: "Accesso effettuato!", username, isAdmin: user.isAdmin, userId: user._id })
        } catch(error) {
            return res.status(500).json(error);
        }
    }
)

export default loginRouter;