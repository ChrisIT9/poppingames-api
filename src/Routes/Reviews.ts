import express, { Request } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { session } from '../Connections/session';
import { requiresAuth } from '../Controllers/Auth';
import { validNumberIfExists, validStringIfExists } from '../Controllers/Generic';
import { isValidReviewIfExists } from '../Controllers/Review';
import { Review } from '../Models/Review.model';
import { ReviewInterface } from '../Models/Types';

const reviewsRouter = express.Router();
reviewsRouter.use(session);

reviewsRouter.get(
    '/', 
    query('reviewedBy').custom(validStringIfExists).withMessage("Username non valido!"),
    query('limit').custom(validNumberIfExists).withMessage("Limite non valido!"),
    async (req: Request<{}, {}, {}, { reviewedBy: string | undefined, limit: string | undefined }>, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array().map(item => item.msg) });
        try {
            let { limit, ...filters } = req.query;
            if (!limit) limit = "30";
            const reviews: ReviewInterface[] = await Review.find({ $and: [filters] }).limit(Number(limit));
            return res.status(200).json(reviews);
        } catch(error: any) {
            return res.status(500).json(error);
        }
    }
)

reviewsRouter.post(
    '/:gameId',  
    requiresAuth,
    param('gameId').exists().isNumeric().withMessage("ID non valido!"),
    body('content').custom(isValidReviewIfExists).withMessage("Recensione non valida!"),
    body('rating').exists().withMessage("Fornire un voto!").isFloat({ min: 0.0, max: 10.0 }).withMessage("Valore voto non valido!"),
    async (req: Request<{ gameId: string }, {}, { rating: number, reviewContent: string | undefined }>, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array().map(item => item.msg) });
        try {
            const { gameId } = req.params;
            const { rating, reviewContent } = req.body;
            const review = await Review.findOneAndUpdate
                (
                    { gameId: Number(gameId), reviewedBy: req.session.username }, 
                    { rating, reviewContent, time: Date.now() }, 
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                )
            await review.save();
            return res.status(200).json({ review })
        } catch(error: any) {
            return res.status(500).json(error);
        }
    }
)

reviewsRouter.get(
    '/:gameId', 
    param('gameId').exists().withMessage("Fornire un ID!").isNumeric().withMessage("ID non valido!"),
    async (req: Request<{ gameId: number }>, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array().map(item => item.msg) });
        try {
            const { gameId } = req.params;
            const reviews = await Review.find({ gameId });
            return res.status(200).json(reviews);
        } catch(error) {
            return res.status(500).json(error)
        }
    }
)

export default reviewsRouter;