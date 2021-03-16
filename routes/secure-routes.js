const express = require('express');
const router = express.Router();
const UserModel = require('../model/model');



router.get(
    '/profile',
    (req, res, next) => {
        res.json({
            message: 'You made it to the secure route',
            user: res.user,
            token: req.query.secret_token
        })
    }
);

router.put(
    '/edit',
    (req, res, next) => {
        const id = req.body._id;
        UserModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    email: req.body.email,
                    password:req.body.password,
                    name: req.body.name,
                    age: req.body.age,
                    gender: req.body.gender
                }
            },
            {
                upsert: true
            },
            async (error, result) => {
                try{
                    res.json({
                        message: "Your data have been updated",
                        user: res.user
                    })
                } catch (error) {
                    res.send(error)
                }
            }
        )
    }
)

module.exports = router;