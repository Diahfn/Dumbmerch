const { profile, user } = require('../../models')

exports.addProfile = async (req, res) => {

    try {

        const pro = {
            phone: req.body.phone,
            gender: req.body.gender,
            address: req.body.address,
            image: req.file.filename,
            idUser: req.user.id
        }

        let newProfile = await profile.create(pro)

        let data = await profile.findOne({
            where: {
                id: newProfile.id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        data = JSON.parse(JSON.stringify(data))

        res.send({
            status: 'Success',
            data: {
                ...data,
                image: process.env.PATH_FILE + data.image
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

exports.getProfile = async (req, res) => {
    try {

        const idUser = req.user.id

        let data = await profile.findOne({
            where: {
                idUser
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        data = JSON.parse(JSON.stringify(data))

        data = {
            ...data,
            image: data.image ? process.env.PATH_FILE + data.image : null
            // image: process.env.PATH_FILE + data.image
        }

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