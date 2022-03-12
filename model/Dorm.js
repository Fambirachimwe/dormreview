import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import {reviewSchema} from './Review.js'


//  this is for the college dorms here

const dormSchema = new Schema({  /// college dorms
    belongsTo: {type: Schema.Types.ObjectId, ref: 'Building'},
    name: String,
    images: [{type: String, caption: String}],  // image url with caption
    description: String,
    reviews: [reviewSchema]
});


const Dorm = mongoose.model('Dorm', dormSchema);


export default Dorm;


