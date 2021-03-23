const mongoose = require('mongoose');
const UserModel = require('../model/model');

const userData = {
    email : 'brock@email.com',
    password : 'password',
    name : 'Brock',
    age : 15,
    gender : 'male',
}

describe('Unit Test', ()=>{
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });
    it('create & save user successfully', async () => {
        const validUser = new UserModel(userData);
        const savedUser = await validUser.save();
        expect(savedUser._id).toBeDefined();
        expect(savedUser.email).toBe(userData.email);
        expect(savedUser.name).toBe(userData.name);
        expect(savedUser.gender).toBe(userData.gender);
        expect(savedUser.age).toBe(userData.age);
        expect(savedUser.loginUsing).toBe(userData.loginUsing);
    });

    it('insert user successfully, but the field does not defined in schema should be undefined', async () => {
        const userWithInvalidField = new UserModel({email:'brock2@email.com',password: 'password', name: 'Brock', gender: 'Male',age:15, nickname: 'Handsome Brock' });
        const savedUserWithInvalidField = await userWithInvalidField.save();
        expect(savedUserWithInvalidField._id).toBeDefined();
        expect(savedUserWithInvalidField.nickname).toBeUndefined();
    });

    it('create user without required field should failed', async () => {
        const userWithoutRequiredField = new UserModel({ name: 'Brock' });
        let err;
        try {
            const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
            error = savedUserWithoutRequiredField;
        } catch (error) {
            err = error
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
        expect(err.errors.email).toBeDefined();
        expect(err.errors.password).toBeDefined();
    });


})