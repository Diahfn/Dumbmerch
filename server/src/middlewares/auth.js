const jwt = require('jsonwebtoken')

exports.auth = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).send({
            status: 'Failed',
            message: 'Access Denied'
        })
    } 

    try {
        
        const verified = jwt.verify(token, process.env.TOKEN_KEY)

        req.user = verified
        // If token valid go to the next request
        next()
    } catch (error) {
        res.status(400).send({
            status: 'Failed',
            message: 'Invalid token!'
        })
    }
}