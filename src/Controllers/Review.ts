import { NextFunction, Request, Response } from 'express';

export const isValidReviewIfExists = (param: string | undefined) => {
    if (param === undefined || (param !== undefined && param.length >= 1 && param.length <= 140))
        return true;
    
    throw "Recensione non valida!";
}

export const canSeeReviews = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.isAdmin || req.params.username === req.session.username)
        return next();

    return res.status(401).json({ message: "Non puoi vedere le recensioni di questo utente." });
}

