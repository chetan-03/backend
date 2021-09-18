const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser.js')
const JWT_SECRET = 'chetanvanam7890$_';
router.post('/createuser', [
    body('name', 'Enter Valid name').isLength({ min: 3 }),
    body('email', 'Enter Valid Email').isEmail(),
    body('password', 'Password must be atleast 5 charecters').isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({
                error: "Sorry a user with this email already exists!",
                success
            })
        }
        // Hashing the user Password
        const salt = bcrypt.genSaltSync(10);
        const secPass = bcrypt.hashSync(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        //     .then(user => res.json(user))
        //     .catch(err => res.status(400).json({
        //     message: err.message
        // }));
        success = true;
        res.json({ authToken, success })
    }
    catch (err) {
        console.error(err.message);
        success = false
        res.status(500).send(success, 'Internal Server error occured!')
    }
})
//  Route 2: 
router.post('/login', [
    body('email', 'Enter Valid Email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    const success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Please enter correct Credentials!' })
        }
        const passwordComp = await bcrypt.compare(password, user.password);
        if (!passwordComp) {
            return res.status(400).json({ error: 'Please enter correct Credentials!' });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        res.json({ success: true, authToken })

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Internal Server Error occured!')
    }
});
// Router 3: retriving user details with the help of jwt token(in that we have user id)
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        res.send(user);
    } catch (err) {
        console.log('Router 3 post' + err.message);
        res.status(500).send('Internal Server Error occured!');
    }
})
module.exports = router;