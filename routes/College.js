import 'dotenv/config';
import express from "express";
import College from '../model/College.js';
import { isAuth } from '../util/IsAuth.js';
import multer from "multer";
import cloudinary from "../util/cloudinary.js"
import fs from "fs"


const router = express.Router();
const upload = multer({ dest: 'uploads/' })


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


router.post('/', upload.array("image") , async (req, res, next) => {
    const { name, location, address, website } = req.body;

    const _imgs = [];
    const files = req.files;


    try{

        for( const file of files){

            const {path}  = file;

            const result = await cloudinary.v2.uploader.upload(path)
            const imgSchema = {
                img_url: result.secure_url,
                cloudinary_id: result.public_id
            }
            _imgs.push(imgSchema);
            fs.unlinkSync(path);  // deleting the file from the server folder


        }
        
        new College({
            name: name,
            location: location,
            address: address,
            website: website,
            images: _imgs

        }).save().then(data => {
            res.status(200).json({
                message: "new College Added",
                college: data
            });
        }).catch(err => {
            res.send(err)
        })

    } catch (err) {
        console.log(err);
    }

    
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



//  delete  College image
router.delete('/remove_image/:collegeId/:cloudinary_id', upload.array('image') ,async (req, res, next) => {
    const image_id = req.params.cloudinary_id;  // cloudinary image id
    const collegeId = req.params.collegeId
    const college = await College.findById({_id: collegeId});

    // delete image from the schema in the database

    let images = college.images;
    let newImagesArray;


    if(image_id){
        newImagesArray = images.filter(image => {
            return image.cloudinary_id !== image_id
        });
        college.images = newImagesArray;

        try {
            await cloudinary.v2.uploader.destroy(image_id);
            const result = await college.save();
            res.json({
                message: "image removed from the schema",
                result
            })
        } catch (error) {
            return res.send('error in saving', error)
        }
    }

})


// update college images 

router.put('/images/:collegeId/:cloudinary_id', upload.single('image') ,async (req, res, next) => {
    const image_id = req.params.cloudinary_id;  // cloudinary image id
    const collegeId = req.params.collegeId
    const college = await College.findById({_id: collegeId});

    // delete image from the schema in the database

    let images = college.images;
    let newImagesArray;


    if(image_id){
        newImagesArray = images.filter(image => {
            return image.cloudinary_id !== image_id
        });
        college.images = newImagesArray;

        try {
            await cloudinary.v2.uploader.destroy(image_id); // delete from cloudinary
            await college.save(); // delete from database
        } catch (error) {
            return res.send('error in saving', error)
        }
    }

     
    if(req.file){  // save the new image here
     
        const result = await cloudinary.v2.uploader.upload(req.file.path)
        const imgSchema = {
            img_url: result.secure_url,
            cloudinary_id: result.public_id
        }
        college.images = [...college.images, imgSchema]

        try {
            
            const result = await college.save(); // delete from database
            fs.unlinkSync(req.file.path);  // deleting the file from the server folder
            res.json({
                message: "image updated ",
                result
            })
        } catch (error) {
            return res.send('error in saving', error)
        }

        
    }

    
    
})












export default router;