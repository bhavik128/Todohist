const jwt = require('jsonwebtoken');
const User = require('../models/users');
require('dotenv').config();

const authUser = (req,res,next) => {
    const token = req.cookies.jwtAuth;
    if(token) {
        jwt.verify(token,process.env.JWT_SECRET,async (err,decoded) => {
            if(err) {
                res.locals.user = null;
                res.redirect('/login');
            } else {
                res.locals.user = await User.findById(decoded.id);
                next();
            }
        });
    } else {
        res.locals.user = null;
        res.redirect('/login');
    }
}

const alreadyLoggedIn = (req,res,next) => {
    const token = req.cookies.jwtAuth;
    if(token) {
        jwt.verify(token,process.env.JWT_SECRET, (err,decoded) => {
            if(err) {
                res.locals.user = null;
                next();
            } else {
                res.redirect('/dashboard');
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
}

const checkSameUser = (req,res,next) => {
    const token = req.cookies.jwtAuth;
    if(!token) {
        res.redirect('/404');
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.redirect('/404');
            } else if (decoded.id !== req.params.userID) {
                res.redirect('/404');
            } else {next();}
        })
    }
}

module.exports = {authUser,alreadyLoggedIn,checkSameUser};