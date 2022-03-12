
import 'dotenv/config';
import express from 'express';
import User from '../model/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createClient } from 'redis';
import { isAuth } from '../util/IsAuth.js';


const router = express.Router();

const tokenList = {};

const client = createClient();

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();


// async()



//  login
router.post('/signin', (req, res, next) => {

    const { email, password } = req.body;
    User.find({ email: email }).then(data => {
        if (data[0]) {
            // go and compare the password to the salted hash
            bcrypt.compare(password, data[0].password, (err, result) => {
                if (result) {
                    const token = jwt.sign({
                        username: data[0].username,
                        email: data[0].email,
                        _id: data[0]._id
                    }, `${process.env.JWT_SECRET}`, { expiresIn: 900 });

                    const refreshToken = jwt.sign({
                        username: data[0].username,
                        email: data[0].email,
                        _id: data[0]._id
                    }, `${process.env.REFRESH_JWT_SECRET}`, { expiresIn: 86400 });

                    // store the tokens in a redis db

                    client.set('refreshToken', refreshToken);
                    client.set('token', token);


                    // tokenList.refreshToken = refreshToken;
                    // tokenList.token = token;

                    // console.log(tokenList)

                    res.status(200).json({
                        token: token,
                        refreshToken: refreshToken,
                        // tokenList: tokenList
                    })

                } else {
                    res.send('Email or password is incorrect')
                }
            });
        } else {
            res.send('User with provided email not found')
        }
    })


})


//  register
router.post('/signup', (req, res, next) => {

    const { username, email, password, collegeId } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            res.send(err)
        } else {
            new User({
                username: username,
                email: email,
                password: hash,
                college: collegeId

            }).save().then(data => {
                res.status(200).json({
                    message: 'ne user created',
                    user: data
                })
            })

        }
    });





})


// get new token when  it expires
router.post('/refreshToken', isAuth, async (req, res, next) => {
    const { refreshToken, username, email } = req.body;

    const myrefreshToken = await client.get('refreshToken')

    // await console.log(myrefreshToken)
    // myrefreshToken

    if (refreshToken && refreshToken === myrefreshToken) {
        const newToken = jwt.sign({ username: username, email: email, _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: 900 });

        // tokenList.token = newToken;

        client.set('token', newToken)


        res.status(200).json({
            token: newToken
        })
    } else {
        res.status(404).send('Invalid request')
    }
})





export default router;