import mongoose from 'mongoose';
const Schema = mongoose.Schema;


export const reviewSchema = new Schema({
    by: {type: Schema.Types.ObjectId, ref: 'User'},
    review: String,
    ratting: Number,
    approved: {type: Boolean, default: false}
});


