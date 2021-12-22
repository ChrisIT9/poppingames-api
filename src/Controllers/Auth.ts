import { NextFunction, Request, Response } from "express";

export const isAlreadyLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.userId)
        return res.status(400).json({ message: "Hai già effettuato l'accesso!" });

    return next();
}

export const requiresAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId)
        return res.status(401).json({ message: "Devi effettuare l'accesso!" });

    return next();
}
