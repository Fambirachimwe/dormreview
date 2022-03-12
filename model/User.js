import mongoose from 'mongoose';
const Schema = mongoose.Schema;



const userSchema = new Schema({
    username: String,
    email: {type: String, unique: true},
    password: String,
    reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}],
    college: {type: Schema.Types.ObjectId, ref: 'College'}
});


const User = mongoose.model('User', userSchema);
export default User;


