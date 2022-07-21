const express = require('express')

const router = express.Router()

// Import modlue from controllers
const { register, login, checkAuth } = require('../controllers/auth')

const { 
    addProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
} = require('../controllers/products')

const {
    addCategory,
    getAllCategory,
    getCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/category')

const {
    addUser,
    getUser,
    getUsers,
    updateUser,
    // deleteUser
} = require('../controllers/user')

const { addProfile, getProfile } = require('../controllers/profile')
const { addTransaction, getTransaction, notification } = require('../controllers/transaction')

const { auth } = require('../middlewares/auth')
const { uploadFiles } = require('../middlewares/uploadFiles')

// Route auth
router.post('/register', register)
router.post('/login', login)
router.get('/check-auth', auth, checkAuth)

// Route products
router.post('/product', auth, uploadFiles('image'), addProduct)
router.patch('/product/:id', auth, uploadFiles('image'), updateProduct)
router.delete('/product/:id', auth, deleteProduct)
router.get('/product/:id', auth, getProduct)
router.get('/products', auth, getAllProducts)

router.post('/profile', auth, uploadFiles('image'), addProfile)
router.get('/profile', auth, getProfile)

router.post('/transaction', auth, addTransaction)
router.get('/transactions', auth, getTransaction)
router.post('/notification', notification)

// Route categories
router.post('/category', addCategory)
router.get('/category/:id', getCategory)
router.patch('/category/:id', updateCategory)
router.delete('/category/:id', deleteCategory)
router.get('/categories', getAllCategory)

// Route user
router.post('/user', addUser)
router.get('/users', getUsers)
router.get('/user/:id', getUser)
router.patch('/user/:id', updateUser)
// router.delete('/user/:id', deleteUser)


module.exports = router