import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/User.js';
import collegeRoutes from './routes/College.js'
import buildingRoutes from './routes/Building.js';
import dormRoutes from './routes/Dorm.js';
import offCampusRoutes from './routes/OffCampusAccomodation.js';
import roomRoutes from "./routes/Room.js"

import mongoose from 'mongoose';

const app = express();

mongoose.connect('mongodb://localhost:27017/myapp', () => {
    console.log('connected to database')
})


// middlewares here

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



// routes here 

app.use('/user', userRoutes);
app.use('/college', collegeRoutes);
app.use('/building', buildingRoutes)
app.use('/dorms', dormRoutes)
app.use('/offcampus', offCampusRoutes);
app.use("/rooms", roomRoutes)




app.listen(process.env.DEV_PORT | 4000, () => {
    console.log(`server started on ${process.env.DEV_PORT || 4000}`)
});