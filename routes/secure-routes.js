const express = require('express');
const router = express.Router();
const UserModel = require('../model/model');
const bcrypt = require('bcrypt');
const Pokedex = require('pokedex-promise-v2');
const { response } = require('express');
const { findByIdAndUpdate, findById } = require('../model/model');
const P = new Pokedex();

//User Secure routes//
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


//Pokemons secure routes

router.put(
    '/create',
    (req, res) => {
        const id = req.body._id;
        const pname = req.body.pname;
        const pokemons = {
            pokemon: req.body.pokemon,
            pokemonName: req.body.pname
        }
        P.getPokemonByName(pokemons.pokemon)
            .then(function (response) {
                if (pname == undefined) {
                    pokemons.pokemonName = response.name;
                }
                UserModel.findByIdAndUpdate(
                    id,
                    { $push: { pokemonList: pokemons } },
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
            })
            .catch(function (error) {
                res.status(404).json("Pokemon not found");
            });

    }
)



router.put(
    '/delete',
    (req, res) => {
        const id = req.body._id;
        const objID = req.body.pokeId;
        UserModel.findByIdAndUpdate(
            id,
            { $pull: { pokemonList: { _id: objID } } },
            async (error, result) => {
                try {
                    res.json({
                        message: "The pokemon was deleted from your pokemon list",
                    })
                } catch (error) {
                    res.status(404).json("Pokemon not found");
                }
            }
        )

    }
)

router.get(
    '/list',
    (req, res) => {
        const id = req.body._id;
        UserModel.findById(id).exec(function (err, user) {
            return res.send(JSON.stringify(user.pokemonList));
        })
    }
)

router.get(
    '/details',
    (req, res) => {
        const id = req.body._id;
        const objID = req.body.pokeId;
        UserModel.findById(id).exec(function (err, user) {
            const pokemonIndex = user.pokemonList.find(element => element._id == objID)
            console.log(pokemonIndex);
            P.getPokemonByName(pokemonIndex.pokemon)
                .then(function (response) {
                    res.send(response);
                })
                .catch(function (error) {
                    res.send(error);
                });
        })
    }
)

router.put(
    '/editPokemon',
    (req, res) => {
        const id = req.body._id;
        const objID = req.body.pokeId;
        const name = req.body.pokemonName;
        
        UserModel.findOneAndUpdate(
            {"_id":id,"pokemonList._id":objID},
            {
                $set: {
                    "pokemonList.$.pokemonName" : name
                }
                
            },
            async (error, result) => {
                try {
                    res.json({
                        message: "The pokemon name has been changed",
                    })
                } catch (error) {
                    res.status(404).json("Pokemon not found");
                }
            }

        )
    }
)





module.exports = router;