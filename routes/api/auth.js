const express = require('express');
const auth = require('../../middleware/auth');
const User = require('../../models/User')

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const config = require('config')

const { check, validationResult } = require('express-validator/check');

const router = express.Router();



    router.get('/', auth, async (req, res) => {
        
        // res.send('AUTH ROUTE')
            try {
                    const user = await User.findById(req.user.id).select('-password');
     
                    res.json(user);

            } catch(err) {
                    console.error(err);
                    res.status(500).send('Server error')

            }
            
    
    });




    router.post('/', [
     
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password required').exists()

       ], 
       
       async (req, res) => { 
                                        const errors = validationResult(req);
                                            if (!errors.isEmpty()) {
                                                return res.status(400).json({ errors: errors.array() });    
                                            };

                                                try {
                                                        const { email, password } = req.body;
                                                        let user = await User.findOne({ email: email });
                                                        console.log(user);
                                                            if (!user) {
                                                                res.status(400).json({errors: [{msg: 'User does not exist'}]});
                                                                // console.log('user does not exist',user);
                                                            };

                                                          
                                                                const isMatch = await bcrypt.compare(password, user.password);

                                                                // console.log('does the passwords Match?',isMatch);

                                                                        if (!isMatch) {
                                                                                res.status(400).json({errors: [{msg: 'Invalid credentials'}]});

                                                                        }

                                                            
                                                                const payload = {
                                                                        user:{
                                                                            id: user.id
                                                                        }

                                                                }

                                                                
                                                            

                                                                    jwt.sign(payload, config.get('jwtSecret'),{expiresIn: 36000}, (err, token) => {
                                                                        if (err) throw err;
                                                                         res.json({token});
                                                                         console.log(token);
                                                                         
                                                            });

                                                                        
                  
                                                                
                                                    } catch(err) {
                                                            console.error(err.message);
                                                            res.status(500).send('Server error');
                                                    }
                                                    

                                   
                                      });




module.exports = router;