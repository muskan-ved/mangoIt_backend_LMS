const { generateToken, hashPassword, isValidPassword } = require('../helper/auth')
const db = require('../models/index.model')
const User = db.User

exports.registration = async (req, res) => {
    const {
        first_name,
        last_name,
        email,
        password,
        role_id,
    } = req.body


    if (!email || !password) {
        res.status(400).json('Email and Password Required!')
    }

    const findUser = await User.findOne({ where: { email: email } })
    if (findUser) {
        res.status(400).json('Email already Registered!')
    }

    if (!findUser) {
        const user = await User.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: await hashPassword(password),
            role_id: role_id,
        })
        res.status(201).json(user)
    }


}

exports.loginUser = async (req, res) => {

    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).json('Email and Password Required!')
    }

    const user = await User.findOne({ where: { email: req.body.email } })
    if (!user) {
        res.status(404).json('User not exist with this Email!')
    }

    const validPassword = await isValidPassword(password, user.password)

    if (!validPassword) {
        res.status(400).json('Password Incorrect!')
    }
    if (validPassword) {
        const token = await generateToken({
            id: user.id,
            email: user.email,
        })

        res.status(200).json({
            userDetails: user,
            loginToken: token,
        })
    }

}

exports.updateUser = async (req, res) => {
    const userId = req.params.id

    const findUser = await User.findOne({ where: { id: userId } })
    if (!findUser) {
        res.status(404).json('User not Found!')
    }
    if (findUser) {

        const {
            first_name,
            last_name,
            email
        } = req.body

        // password: await hashPassword(req.body.password)

        const firstName = await User.findOne({ where: { first_name: first_name } })
        const lastName = await User.findOne({ where: { last_name: last_name } })
        const findEmail = await User.findOne({ where: { email: req.body.email } })

        if (!firstName || !lastName) {
            const updateName = await User.update({ first_name: first_name, last_name: last_name }, { where: { id: userId } })
            res.status(201).json(req.body)
        }

       
        if ((firstName && lastName) || !findEmail) {
            const updateUser = await User.update({ email: email }, { where: { id: userId } })
            res.status(201).json(req.body)
        }

        // if ((firstName && lastName) || findEmail) {
        //     res.status(400).json('This email exist with another user!')
        // }

    }

}