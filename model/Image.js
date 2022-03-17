import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    img_url: String,
    cloudinary_id: String
});

export default imageSchema;
