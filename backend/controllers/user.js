const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const {userExtractor} = require('../utils/middleware')

usersRouter.post('/', async (req, res) => {
    const {email, name, password} = req.body
    if(!name || name.length < 3 || !password || password.length < 3){
        return res.status(400).json({error: "Email or password do not meet minimum length requirement!"})
    }

    const user_exists = await User.find({email})
    console.log(user_exists)
    if(user_exists.length !== 0){
        return res.status(400).json({error: "Email existed, please choose another email!"})
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const new_user = new User({
        email,
        name,
        passwordHash
    })

    const savedUser = await new_user.save()
    res.status(201).json(savedUser)
})

usersRouter.get('/', async(req, res) => {
    const user_list = await User.find({}).populate('foods')
    res.json(user_list)
})

// We have token which has the information about id so do not need the id in here
usersRouter.put('/', userExtractor, async(req, res) => {
    const user = req.user
    if(!user){
        res.status(400).json({error: "Invalid userId or token expired"})
    }
    
    if(req.body.oldPassword){
        const check_password = await bcrypt.compare(req.body.oldPassword, user.passwordHash)
        
        if(!check_password){
            return res.status(400).json({error: "Old password is not correct!"})
        }
        const passwordHash = await bcrypt.hash(req.body.newPassword, 10)
        
        user.passwordHash = passwordHash
        await user.save()

        return res.status(200).json({message: "Password updated successfully!"})
    } 

    else if (req.body.name) {
        user.name = req.body.name
        await user.save()
        return res.status(200).json({message: "Update name successfully!"})
    }
})

module.exports = usersRouter