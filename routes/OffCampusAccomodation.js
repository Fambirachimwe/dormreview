import express from 'express';
import OffCampusAccomodation from "../model/OffCampusAccomodation.js";

const router = express.Router();


router.get('/', (req, res, next) =>{
    OffCampusAccomodation.find().then(data => {
        if(data.length > 0){
            res.json(data)
        } else {
            res.send("NO Off campus registered")
        }
    })
});



router.get('/:offId', (req, res, next) => {
    const id = req.params.offId;

    OffCampusAccomodation.findById(id).then(data => {
        if (data) {
            res.json(data)
        } else {
            res.status(401).send('House not found')
        }
    })
});

router.post('/', (req, res, next) => {
    const { name, location, address, description, images, contact } = req.body;

    new OffCampusAccomodation({
        name: name,
        location: location,
        address: address,
        description: description,
        images: images,
        contact: contact
    }).save().then(data => {
        res.status(200).json({
            message: "new House  Added",
            house: data
        });
    }).catch(err => {
        res.send(err)
    })
});


router.put("/:id/update", (req, res, next) => {
    const update = req.body;
    const id = req.params.id;

    OffCampusAccomodation.findByIdAndUpdate(id, {...update}).then(data => {
        if(data){
            res.send("Updated")
        }
    }).catch(err => {
        res.send(err)
    })

})











export default router