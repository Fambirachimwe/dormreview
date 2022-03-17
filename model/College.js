import mongoose from 'mongoose';
import imageSchema from "./Image.js"
const Schema = mongoose.Schema;



const collegeSchema = new Schema({
    name: String,
    location: {  // this is a geojson objects to hold location
        type: {
            type: String, 
            enum: ['Point'], 
            required: false
        },
        coordinates: {
            type: [Number],
            required: false
        }
    },
    address: String,
    website: String,
    Buildings: [{type: Schema.Types.ObjectId, ref: 'Building'}],
    images: [imageSchema] // collge images

});

const College = mongoose.model('College', collegeSchema);

export default College;




