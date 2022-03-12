import express from 'express';
import Room from '../model/Room.js';
import { isAuth } from '../util/IsAuth.js';


const router = express.Router();


router.get('/', isAuth, (req, res, next) => {
    Room.find().then(data => {
        if(data.length > 0){
            res.json(data)
        } else {
            res.send("No Rooms found")
        }
    })
});

router.get('/count', (req, res, next) => {
    Room.find().then(data => {
        res.json({
            count: data.length
        })
    })
})




router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Room.findOne({_id: id }).then(data => {
        if(data) {
            res.send(data)
        } else {
            res.send("Room not found")
        }
    });
});

// delete Room

router.delete('/delete/:id', (req, res, next) => {
    const id = req.params.id;

    Room.findOneAndRemove({_id: id}).then(data => {
        if(data){
            res.send("Room deleted ")
        }
    })

});

// update Room
router.put("/update/:did", (req, res, next) => {
    const Room_id = req.params.did;

    const update = req.body;

    Room.findByIdAndUpdate(Room_id, {...update}).then(data => {
        if(data){
            res.json(data)
        }
    }).catch(err => {
        res.send(err)
    })
});

router.delete('/delete/:id', (req, res, next) => {
    const {id} = req.params;

    Room.findByIdAndDelete(id).then(() => {
        res.send("Room deleted")
    }).catch(err => {
        res.send(err)
    })
})




router.post('/',(req, res,next) => {
    const {belongsTo, name, images, description, reviews } = req.body

    new Room({
        belongsTo: belongsTo,
        name: name,
        images: images,
        description: description,
        reviews: reviews
    }).save()
    .then(data => {
        res.json(data)
    }).catch(err => res.send(err))
})


// get review by Room id 
router.get("/:room_id/reviews", (req, res, next) => {
    const {Room_id} = req.params;
    Room.findById(Room_id).then(data => {
        if(data){
            res.json({
                reviews: data.reviews
            })
        } else {
            res.send("No reviews yet")
        }
    })

})

// add review to room 
router.put('/:room_id/reviews', isAuth, async (req, res, next) => {
    const review = req.body;  // object review schema
    // populate the by id of the review schema
    review.by = req.user._id;
    const {room_id} = req.params;
    const room = await Room.findById(room_id);

    let reviews = room.review // this is the review array
    // push another review
    reviews.push(review)
    room.review = reviews;

    try{
        const result = await room.save();
        res.json({
            message:"Review added",
            result
        })
    } catch(err){
        return res.send('erro in saving ', err)
    }

});

// delete review 

router.delete("/:room_id/reviews" ,async (req, res, next) => {

    const {room_id} = req.params;
    const { reviewId } = req.query
    const room =  await Room.findById(room_id);

    let reviews = room.review;

    const newReviewArray = reviews.filter((review) => {
        return review._id.toString() === reviewId
    });

    room.review = newReviewArray;

    try{
        const result = await room.save();
        res.json({
            message:"Review deleted",
            result
        })
    } catch(err){
        return res.send('erro in saving ', err)
    }

})







export default router;