const { user, profile } = require('../../models')

exports.addUser = async (req, res) => {
    try {
        await user.create(req.body)

        res.send({
            status: 'Success',
            message: 'Add user success'
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'Failed',
            mesage: 'Serer Error'
        })
    }
}

exports.getUsers = async (req, res) => {
    try {
        const data = await user.findAll({
            include: {
                model: profile,
                as: 'profiles',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'idUser']
                }
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        })

        res.send({
            status: 'Success',
            data: {
                data
            }
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'Failed',
            message: 'Server Error'
        })
    }
}

exports.getUser = async (req, res) => {
    try {
        const { id } = req.params

        const data = await user.findOne({
            where: {
                id
            },
            include: {
                model: profile,
                as: 'profiles',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'idUser']
                }
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        })

        res.send({
            status: 'Success',
            data: {
                user: data
            }
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'Failed',
            message: 'Server Error'
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params

        const data = await user.update(req.body, {
            where: {
                id
            }
        })

        res.send({
            status: 'Success',
            data
        })

    } catch (error) {
        console.log(error)
        res.send({
            status: 'Failed',
            message: 'Server Error'
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        await user.destroy({
            where: {
                id
            }
        })

        res.send({
            status: 'Success',
            message: `Delete user id ${id} success`
        })
        
    } catch (error) {
        console.log(error)
        res.send({
            status: 'Failed',
            message: 'Server Error'
        })
    }
}