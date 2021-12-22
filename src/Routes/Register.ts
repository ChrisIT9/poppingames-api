import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { User } from '../Models/User.model';
import { isAlreadyLoggedIn } from '../Controllers/Auth';
import { session } from '../Connections/session';

const registerRouter = express.Router();
registerRouter.use(session);

registerRouter.post(
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
            if (user) return res.status(400).json({ message: "Esiste già un utente con questo username!" });
            const encryptedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, password: encryptedPassword });
            await newUser.save();
            return res.status(201).json({ message: "Utente registrato con successo!", username });
        } catch(error) {
            return res.status(500).json(error);
        }
    }
)

export default registerRouter;