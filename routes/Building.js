import 'dotenv/config';
import express from 'express';
import Building from "../model/Building.js";
import Dorm from '../model/Dorm.js';
import { isAuth } from '../util/IsAuth.js';


const router = express.Router();


router.get('/', (req, res, next) => {
    Building.find().then(data => {
        if(data.length > 0){
            return res.json({
                buildings: data
            })
        } else {
            res.send('No Buildings found')
        }
    })
});


// get building by collegeId
router.get('/college/:cid', (req, res, next) => {
    const college_id = req.params.cid;

    Building.find({college: college_id}).then(data => {
        if(data){
            res.json({
                data
            })
        } else {
            res.send('building not found')
        }
    })
});


//  get by building id

router.get('/:bid', (req, res, next) => {
    const building_id = req.params.bid;

    Building.findOne({_id:building_id}).then(data => {

        if(data){
            res.json(data)
        } else{
            res.send('Building not found')
        }
    })
});

// add Building

router.post('/', (req, res, next) => {
    const {name, dorms, college} = req.body;

    // check if the dorms are in the dorms list 

    // validate if the college id exist in the database 
    //  validate if the dorms has been created

    new Building({
        name: name,
        college: college,  // id of the college //
        dorms: dorms
    }).save()
    .then(data => {
        res.json({
            message: "New Building Added",
            data
        })
    })
});



// add college / domrms  to building

router.put('/:bid', async (req, res, next) => {

    const {bid} = req.params
    const {college, dorms} = req.body;
    // domrm is a list of ids from te dorms schema

    // console.log(dorms)

    let _dorms;

    if(dorms.length > 0){
       var my_dorms =  await Dorm.find().where('_id').in(dorms.map(_id => _id));

    //    console.log(my_dorms)

       if(my_dorms.length > 0){
           _dorms = my_dorms
       } else {
           _dorms = dorms
       }
    } else{
        _dorms = []
    }

    if(_dorms.length > 0){
        // save the dorms

        Building.findByIdAndUpdate(bid, {dorms: _dorms}).then(data => {
            res.send(data)
        }).catch(err => {
            res.send(err)
        })
    } 
    // console.log(college)
    if(college){
        Building.findByIdAndUpdate(bid, {college: college})
        .then(data => {
            res.send(data)
        }).catch(err => {
            res.send(err)
        })
    }


})










export default router;
