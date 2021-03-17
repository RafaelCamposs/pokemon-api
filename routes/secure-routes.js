const express = require('express');
const router = express.Router();
const UserModel = require('../model/model');
const bcrypt = require('bcrypt');
const Pokedex = require('pokedex-promise-v2');
const { response } = require('express');
const P = new Pokedex();

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
    '/create',
    (req,res)=>{
        const id = req.body._id;
        const pokemons = req.body.pokemon

        UserModel.findByIdAndUpdate(
            id, 
            {$push: { pokemonList: pokemons } },
            async (error, result) => {
                try {
                    res.json({
                        message: "The pokemon was added to you pokemon list",
                    })
                } catch (error) {
                    res.send(error);
                }
            }
        )
    }
)



router.put(
    '/edit',
    async (req, res) => {
        const id = req.body._id;
        const hash = await bcrypt.hash(req.body.password, 10);
        req.body.password = hash;
        UserModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    email: req.body.email,
                    password: hash,
                    name: req.body.name,
                    age: req.body.age,
                    gender: req.body.gender
                }
            },
            {
                upsert: true,
            },
            async (error, result) => {
                try {
                    res.json({
                        message: "Your data have been updated",
                    })
                } catch (error) {
                    res.send(error)
                }
            }
        )
    }
)

module.exports = router;