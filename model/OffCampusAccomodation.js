import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const offcampSchema = new Schema({
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
    contact: String,
    description: String,
    images: [{type: String}]  // image url 
});


const OffCampusAccomodation = mongoose.model('OfffCampusAccomodation', offcampSchema);


export default OffCampusAccomodation;

