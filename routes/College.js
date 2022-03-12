import 'dotenv/config';
import express from "express";
import College from '../model/College.js';
import { isAuth } from '../util/IsAuth.js';


const router = express.Router();


router.get('/', (req, res, next) => {
    College.find().then(data => {
        if (data.length > 0) {
            res.json({
                colleges: data
            });
        } else {
            res.status(401).send('No Colleges available...')
        }
    })
});


router.get('/:cid', (req, res, next) => {
    const college_id = req.params.cid;

    College.findById(college_id).then(data => {
        if (data) {
            res.json(data)
        } else {
            res.status(401).send('College not found')
        }
    })
});


router.post('/', isAuth, (req, res, next) => {
    const { name, location, address, website } = req.body;

    new College({
        name: name,
        location: location,
        address: address,
        website: website,
    }).save().then(data => {
        res.status(200).json({
            message: "new College Added",
            college: data
        });
    }).catch(err => {
        res.send(err)
    })
});


// add college Buildings
router.put('/:cid', isAuth, async (req, res, next) => {
    const college_id = req.params.cid;
    const buildingId = req.body.buildingId;
    const college = await College.findById(college_id);
    
    if (college) {
        let buildings = college.Buildings;

        // console.log(buildings)


        if (buildings.length > 0) {
            //  check if the buldingId exists in the array

            const belongs = buildings.map(building => {
                return building.toString()
            }).filter(id => {
                return id === buildingId
            });
            
            if (belongs.length > 0) {
                return res.send('Building already added to the College')
            } else {
                buildings.push(buildingId);
                college.Buildings = buildings.map(building => {
                    return building.toString()
                });

                try {
                    const result = await college.save();
                    res.json({
                        message: "Building added",
                        result
                    })
                } catch (error) {
                    return res.send('error in saving', error)
                }

                
            }

        } 
        
        else {

            buildings.push(buildingId);
            college.Buildings = buildings.map(building => {
                return building.toString()
            });
            try {
                const result = await college.save();
                res.json({
                    message: "Building added",
                    result
                })
            } catch (error) {
                return res.send('error in saving', error)
            }

        }

    }

})


// Delete Building from the List of building in the College Array









export default router;