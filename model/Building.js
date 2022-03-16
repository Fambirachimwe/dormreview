import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const buildingSchema = new Schema({
    name: String,
    college: {type: Schema.Types.ObjectId, ref: 'College'}, // college id reference
    dorms: [{type: Schema.Types.ObjectId, ref: 'Dorm'}]  // dorm id reference
});


const Building = mongoose.model('Building', buildingSchema);

export default Building;


