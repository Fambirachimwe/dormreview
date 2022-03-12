import express from 'express';
import Dorm from '../model/Dorm.js';
import { isAuth } from '../util/IsAuth.js';


const router = express.Router();


router.get('/', (req, res, next) => {
    Dorm.find().then(data => {
        if(data.length > 0){
            res.json(data)
        } else {
            res.send("No dorms found")
        }
    })
});

router.get('/count', (req, res, next) => {
    Dorm.find().then(data => {
        res.json({
            count: data.length
        })
    })
})




router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Dorm.findOne({_id: id }).then(data => {
        if(data) {
            res.send(data)
        } else {
            res.send("Dorm not found")
        }
    });
});

// delete Dorm

router.delete('/delete/:id', (req, res, next) => {
    const id = req.params.id;

    Dorm.findOneAndRemove({_id: id}).then(data => {
        if(data){
            res.send("Dorm deleted ")
        }
    })

});

// update Dorm
router.put("/update/:did", (req, res, next) => {
    const dorm_id = req.params.did;

    const update = req.body;

    Dorm.findByIdAndUpdate(dorm_id, {...update}).then(data => {
        if(data){
            res.json(data)
        }
    }).catch(err => {
        res.send(err)
    })
});

router.delete('/delete/:id', (req, res, next) => {
    const {id} = req.params;

    Dorm.findByIdAndDelete(id).then(() => {
        res.send("Dorm deleted")
    }).catch(err => {
        res.send(err)
    })
})




router.post('/',(req, res,next) => {
    const {belongsTo, name, images, description } = req.body

    new Dorm({
        belongsTo: belongsTo,
        name: name,
        images: images,
        description: description
    }).save()
    .then(data => {
        res.json(data)
    }).catch(err => res.send(err))
})


// get review by dorm id 
router.get("/:dorm_id/reviews", (req, res, next) => {
    const {dorm_id} = req.params;
    Dorm.findById(dorm_id).then(data => {
        if(data){
            res.json({
                reviews: data.reviews
            })
        } else {
            res.send("No reviews yet")
        }
    })

})

// add review to dorm 
router.put('/:dorm_id/reviews', isAuth, async (req, res, next) => {
    const review = req.body;  // object review schema

    // populate the by id of the review schema
    review.by = req.user._id;
    const {dorm_id} = req.params;
    const dorm = await Dorm.findById(dorm_id);
    

    let reviews = dorm.reviews // this is the review array
   
    // // push another review
    reviews.push(review)
    dorm.reviews = reviews;

    try{
        const result = await dorm.save();

        res.json({
            message:"Review added",
            result: result
        })
    } catch(err){
        return res.send(err)
    }

});


// delete review 

router.delete("/:dorm_id/reviews" ,async (req, res, next) => {

    const {dorm_id} = req.params;
    const { reviewId } = req.query
    const dorm =  await Dorm.findById(dorm_id);

    let reviews = dorm.reviews;

    const newReviewArray = reviews.filter((review) => {
        return review._id.toString() === reviewId
    });

    dorm.reviews = newReviewArray;

    try{
        const result = await dorm.save();
        res.json({
            message:"Review deleted",
            result
        })
    } catch(err){
        return res.send('erro in saving ', err)
    }

});






export default router;