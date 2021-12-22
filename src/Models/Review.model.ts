import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    gameId: {
        type: Number,
        required: true
    },
    reviewedBy: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0.0,
        max: 10.0
    },
    reviewContent: {
        type: String,
        required: false,
        default: null,
        maxlength: 140
    },
    time: {
        type: Date,
        default: Date.now
    }
});

export const Review = mongoose.model("Review", reviewSchema);