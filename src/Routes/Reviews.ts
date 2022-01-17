import express, { Request } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { session } from '../Connections/session';
import { isAdmin, requiresAuth } from '../Controllers/Auth';
import { validNumberIfExists, validStringIfExists } from '../Controllers/Generic';
import { isValidReviewIfExists } from '../Controllers/Review';
import { Review } from '../Models/Review.model';
import { ReviewInterface } from '../Models/Types';
import { isValidObjectId, Types } from 'mongoose';

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
            const reviews: ReviewInterface[] = await Review.find({ gameId });
            const average = reviews.reduce((acc, { rating }, _, { length }) => acc + (rating / length), 0.0);
            return res.status(200).json({ reviews, average });
        } catch(error) {
            return res.status(500).json(error);
        }
    }
)

reviewsRouter.delete(
    '/:reviewId',
    requiresAuth,
    param('reviewId').exists().withMessage("Fornire un ID!").isString().withMessage("ID non valido!"),
    async (req: Request<{ reviewId: string }>, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array().map(item => item.msg) });
        try {
            const { reviewId } = req.params;

            if (!isValidObjectId(reviewId))
                return res.status(400).json({ message: "ID non valido!" });

            const foundReview: ReviewInterface = await Review.findById(reviewId);

            if (!foundReview) return res.status(400).json({ message: "Recensione non trovata!" });

            if (foundReview && (req.session.isAdmin || foundReview.reviewedBy === req.session.username)) {
                await Review.findByIdAndDelete(reviewId);
                return res.status(200).json({ message: "Recensione cancellata con successo!", review: foundReview });
            }
            else return res.status(401).json({ message: "Non sei autorizzato ad eseguire quest'operazione!" });
        } catch(error) {
            return res.status(500).json(error);
        }
    }
)


export default reviewsRouter;