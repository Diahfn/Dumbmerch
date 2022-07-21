const { user } = require('../../models')

// Import joi validation
const Joi = require('joi')

// Import bcrypt
const bcrypt = require('bcrypt')

// Import jsonwebtoken
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {

    const schema = Joi.object({
        fullname: Joi.string().min(3).required(),
        email: Joi.string().email().min(5).required(),
        password: Joi.string().min(6).required()
    })

    const { error } = schema.validate(req.body)

    if (error) {
        return res.status(400).send({
            error : {
                message: error.details[0].message
            }
        })
    }

    try {

        const userExist = await user.findOne({
            where: {
                email: req.body.email
            }
        })

        // Check if the email already exists or not
        if (userExist) {
            return res.status(400).send({
                status: 'Failed',
                message: 'Email already registered'
            })
        }
        
        // Generate salt (random value) with 10 rounds
        const salt = await bcrypt.genSalt(10)

        // To hash the password of the request with salt
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        const newUser = await user.create({
            fullname: req.body.fullname,
            email: req.body.email,
            password: hashPassword,
            status: 'customer'
        })

        // Generate token
        const token = jwt.sign({ id: user.id }, process.env.TOKEN_KEY)

        res.status(200).send({
            status: 'Success',
            data: {
                name: newUser.fullname,
                email: newUser.email,
                token
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'Failed',
            message: 'Server Error'
        })
    }
}

exports.login = async (req, res) => {
    
    const schema = Joi.object({
        email: Joi.string().email().min(4).required(),
        password: Joi.string().min(6).required()
    })

    const { error } = schema.validate(req.body)

    if (error) {
        return res.status(400).send({
            error: {
                message: error.details[0].message
            }
        })
    }

    try {

        const userExist = await user.findOne({
            where: {
                email: req.body.email
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        if (!userExist) {
            return res.status(400).send({
                status: 'Failed',
                message: 'Email not registered'
            })
        }

        const isValid = await bcrypt.compare(req.body.password, userExist.password)

        if (!isValid) {
            return res.status(400).send({
                status: 'Failed',
                message: 'Password is invalid'
            })
        }

        const token = jwt.sign({ id: userExist.id }, process.env.TOKEN_KEY)

        res.status(200).send({
            status: 'Success',
            data: {
                name: userExist.fullname,
                email: userExist.email,
                status: userExist.status,
                token,
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'Failed',
            message: 'Server Error'
        })
    }
}

exports.checkAuth = async (req, res) => {

    try { 

        const id = req.user.id

        const dataUser = await user.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        })

        if (!dataUser) {
            return res.status(404).send({
                status: 'Failed',
                message: dataUser
            })
        }

        res.send({
            status: 'Success',
            data: {
                user: {
                    id: dataUser.id,
                    name: dataUser.name,
                    email: dataUser.email,
                    status: dataUser.status
                }
            }
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'Failed',
            message: 'Server Error'
        })
    }

}