import mongoose from 'mongoose';

export const dbConnect = () => {
    try {
        mongoose.connect('mongodb://localhost:27017/gaming');
        mongoose.connection.on('error', err => console.log(err));
        mongoose.connection.on('open', _ => console.log("[DB] Connected to database."));
    } catch(dbError: unknown) {
        console.log(dbError);
    }
    
}