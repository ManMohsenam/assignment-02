const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Email Validation Middleware
function validateEmail(req, res, next) {
    const { email } = req.body;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!emailRegex.test(email)) {
        const validation = 'Invalid email.';
        return res.render('add-user', { error: validation });
    }

    next();
}

// Phone Number Validation Middleware
function validatePhoneNumber(req, res, next) {
    const { phone } = req.body;
    const phoneRegex = /^\d+$/;

    if (!phoneRegex.test(phone)) {
        const validation = 'Invalid phone number.';
        return res.render('add-user', { error: validation });
    }

    next();
}

// Routes
router.get('/', userController.view);
router.post('/', userController.find);
router.get('/adduser', userController.form);
router.post('/adduser', validateEmail, validatePhoneNumber, userController.create);

router.get('/edituser/:id', userController.edit);
router.post('/edituser/:id', validateEmail, validatePhoneNumber, userController.update);

router.get('/viewuser/:id', userController.viewUser);
router.get('/:id', userController.delete);

module.exports = router;