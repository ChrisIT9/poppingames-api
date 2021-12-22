import expS from "express-session";
import mongoose from "mongoose";

declare module 'express-session' {
    export interface SessionData {
        userId: mongoose.Types.ObjectId,
        username: string,
        isAdmin: boolean
    }
}

export const session = expS({
    secret: "BOOBA",
    saveUninitialized: true,
    resave: false,
    cookie: {
        sameSite: 'lax',
        httpOnly: false
    }
})