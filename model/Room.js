import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import {reviewSchema} from './Review.js'

//  this is for the college dorms here

const roomSchema = new Schema({  /// college dorms
    belongsTo: {type: Schema.Types.ObjectId, ref: 'OfffCampusAccomodation'},
    name: String,
    images: [{type: String, caption: String}],  // image url with caption
    description: String,
    review: [reviewSchema]
});


const Room = mongoose.model('Room', roomSchema);


export default Room;


