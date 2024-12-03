// backend/controllers/userController.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const User = require('../models/User');

//Generate JWT.
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

//Register a new user.
const registerUser = asyncHandler(async(req, res) => {
    const {name, email, password, role, createdAt, age, gender, phone_number, profile_picture} = req.body;

    if(!name|| !email || !password || !role || !age || !gender || !phone_number)
    {
        res.status(400);
        throw new Error("Please add all fields.");
    }

    const userExists = await User.findOne({email});

    if(userExists)
    {
        res.status(400);
        throw new Error("User already exists.");
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        createdAt,
        age,
        gender,
        phone_number,
        profile_picture
    });

    if(user)
    {
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            age: user.age,
            gender: user.gender,
            phone_number: user.phone_number,
            profile_picture: user.profile_picture,
            token: generateToken(user.id)
        });
    }
    else
    {
        res.status(400);
        throw new Error("Invalid user data.");
    }
});

//Login a user.
const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password)))
    {
        user.lastlogin = Date.now();
        await user.save();
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            lastlogin: user.lastlogin,
            token: generateToken(user.id)
        });
    }
    else
    {
        res.status(401);
        throw new Error("Invalid credentials.");
    }
});

//Get user profile.
const getUserProfile = asyncHandler(async (req, res) => {
    console.log('Request User:', req.user); 
   
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated' }); 
    }

   
    const user = await User.findById(req.user.id).select('-password');
    
    if (user) {
        res.json(user); 
    } else {
        res.status(404).json({ message: 'User not found' }); 
    }
});

module.exports = {registerUser, loginUser, getUserProfile};