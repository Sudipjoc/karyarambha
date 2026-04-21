const router = require('express').Router();
const { register, login, getMe, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', protect, register);   // only authenticated admins can create users
router.post('/register/public', register);      // self-registration (creates employee role)
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

module.exports = router;
