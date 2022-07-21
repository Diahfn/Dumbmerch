const { user, transaction, products } = require('../../models')

const midtransClient = require('midtrans-client')

exports.getTransaction = async (req, res) => {
    try {

        const idBuyer = req.user.id

        let data = await transaction.findAll({
            where: {
                idBuyer
            },
            order: [['createdAt', 'DESC']],
            attributes: {
                exclude: ['updatedAt', 'idBuyer', 'idSeller', 'idProduct']
            },
            include: [
                {
                    model: products,
                    as: 'product',
                    attributes: {
                        exclude: [
                            'createdAt',
                            'updatedAt',
                            'idUser',
                            'qty',
                            'price'
                        ]
                    }
                },
                {
                    model: user,
                    as: 'buyer',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password', 'status']
                    }
                },
                {
                    model: user,
                    as: 'seller',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password', 'status']
                    }
                }
            ]
        })

        data = JSON.parse(JSON.stringify(data))

        data = data.map((item) => {
            return {
                ...item,
                product: {
                    ...item.product,
                    image: process.env.PATH_FILE + item.product.image
                }
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

exports.addTransaction = async (req, res) => {
    try {

        let data = req.body
        data = {
            id: parseInt(data.idProduct + Math.random().toString().slice(3, 8)),
            ...data,
            idBuyer: req.user.id,
            status: 'pending'
        }

        const newData = await transaction.create(data)

        const buyerData = await user.findOne({
            where: {
                id: newData.id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        })

        let snap = new midtransClient.Snap({
             // Set to true if you want Production Environment (accept real transaction).
             isProduction: false,
             serverKey: process.env.MIDTRANS_SERVER_KEY
        })

        let parameter = {
            transaction_details: {
                order_id: newData.id,
                gross_amount: newData.price
            },
            credit_card: {
                secure: true
            },
            customer_details: {
                full_name: buyerData?.fullname,
                email: buyerData?.email,
                phone: buyerData?.profile?.phone
            }
        }

        const payment = await snap.createTransaction(parameter)
        console.log(payment)

        res.send({ 
            status: 'pending',
            message: 'Pending transaction payment gateway',
            payment,
            product: {
                id: data.idProduct
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

const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY

const core = new midtransClient.CoreApi()

core.apiConfig.set({
    isProduction: false,
    serverKey: MIDTRANS_SERVER_KEY,
    clientKey: MIDTRANS_CLIENT_KEY
})

exports.notification = async (req, res) => {
    try {

        const statusResponse = await core.transaction.notification(req.body)
        const orderId = statusResponse.order_id
        const transactionStatus = statusResponse.transaction_status
        const fraudStatus = statusResponse.fraud_status

        console.log(statusResponse)

        if (transactionStatus == 'capture') {
            if (fraudStatus == 'challenge') {
                updateTransaction('pending', orderId)
                res.status(200)
            } else if (fraudStatus == 'accept') {
                updateProduct(orderId)
                updateTransaction('success', orderId)
                res.status(200)
            }
        } else if (transactionStatus == 'settlement') {
            updateTransaction('success', orderId)
            res.status(200)
        } else if (
            transactionStatus == 'cancel' ||
            transactionStatus == ' deny' ||
            transactionStatus == 'expire'
        ) {
            updateTransaction('Failed', orderId)
            res.status(200)
        } else if (transactionStatus == 'pending') {
            updateTransaction('pending', orderId)
            res.status(200)
        }
        
    } catch (error) {
        console.log(error)
        res.send({
            status: 'Failed',
            message: 'Server Error'
        })
    }
}

const updateTransaction = async (status, transactionId) => {
    await transaction.update(
        {
            status
        },
        {
            where: {
                id: transactionId
            }
        }
    )
}

const updateProduct = async (orderId) => {
    const transactionData = await transaction.findOne({
        where: {
            id: orderId
        }
    })

    const productData = await products.findOne({
        where: {
            id: transactionData.idProduct
        }
    })

    const qty = productData.qty - 1
    await products.update({qty}, {where: {id: productData.id}})
}