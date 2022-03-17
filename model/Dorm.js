import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import {reviewSchema} from './Review.js';
import imageSchema from "../model/Image"


//  this is for the college dorms here

const dormSchema = new Schema({  /// college dorms
    belongsTo: {type: Schema.Types.ObjectId, ref: 'Building'},
    name: String,
    images: [imageSchema],  // image url with caption
    description: String,
    reviews: [reviewSchema]
});


const Dorm = mongoose.model('Dorm', dormSchema);


export default Dorm;


