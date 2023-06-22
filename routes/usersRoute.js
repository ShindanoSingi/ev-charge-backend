const router = require('express').Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { registerUser, loginUser, getCurrentUser } = require('../controller/userController');

// Create a new user
router.post('/register', registerUser);
// Login user
router.post('/login', loginUser);
// Get current user
router.get('/current-user', authMiddleware, getCurrentUser);


module.exports = router;