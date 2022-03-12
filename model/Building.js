import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const buildingSchema = new Schema({
    name: String,
    college: {type: Schema.Types.ObjectId, ref: 'College'},
    dorms: [{type: Schema.Types.ObjectId, ref: 'Dorm'}]
});


const Building = mongoose.model('Building', buildingSchema);

export default Building;


