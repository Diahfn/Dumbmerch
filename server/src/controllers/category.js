const { categories, productCategory } = require('../../models')

exports.addCategory = async (req, res) => {
    try {

        const category = await categories.create(req.body)

        res.send({
            status: 'Success',
            data: {
                id: category.id,
                name: category.name
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

exports.getAllCategory = async (req, res) => {

    try {
        
        const category = await categories.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        res.send({
            status: 'Success',
            data : {
                category
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

exports.getCategory = async (req, res) => {

    try {

        const { id } = req.params

        const category = await categories.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        res.send({
            status: 'Success',
            category
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'Failed',
            message: 'Server Error'
        })
    }

}

exports.updateCategory = async (req, res) => {

    try {

        const { id } = req.params

        const category = await categories.update(req.body, {
            where: {
                id
            }
        })

        res.send({
            status: 'Success',
            data: {
                category
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

exports.deleteCategory = async (req, res) => {

    try {

        const { id } = req.params

        await categories.destroy({
            where: {
                id
            }
        })

        await productCategory.destroy({
            where: {
                idCategory: id
            }
        })

        res.send({
            status: 'Success',
            message: `Delete category id: ${id} success`
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'Failed',
            message: 'Server Error'
        })
    }

}