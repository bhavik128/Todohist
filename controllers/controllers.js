const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const handleErrors = (err) => {
    let errors = { email: '', password: '' };

    // duplicate email error
    if (err.code === 11000) {
        errors.email = 'That email is already registered';
        return errors;
    }

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }

    // validation errors
    if (err.message.includes('User validation failed:')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

module.exports.home = (req,res) => {
    res.render('home');
}

module.exports.login_get = (req,res) => {
    res.render('login');
}

module.exports.logout_get = (req,res) => {
    res.cookie('jwtAuth','',{maxAge:1});
    res.redirect('/');
}

module.exports.login_post = async (req,res) => {
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email});
        if(user) {
            const passwordCorrect = await bcrypt.compare(password,user.password);
            if(passwordCorrect) {
                const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
                res.cookie('jwtAuth',token,{httpOnly:true});
                res.status(200).json({id:user._id});
            } else {throw Error('incorrect password');}
        } else {throw Error('incorrect email');}
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.pagenotfound_get = (req,res) => {
    res.render('404');
}

module.exports.signup_get = (req,res) => {
    res.render('signup');
}

module.exports.signup_post = async (req,res) => {
    const {email,password} = req.body;
    res.cookie('jwtAuth','',{maxAge:1});
    try {
        const user = await User.create({email,password});
        res.status(201).json({id:user._id});
    } catch (err) {
       const errors = handleErrors(err);

       res.status(400).json({errors});
    }
}

module.exports.dashboard_get = (req,res) => {
    res.render('dashboard');
}

module.exports.createList_post = async (req,res) => {
    const {listName,userID} = req.body;

    try {
        if(listName.length === 0) {throw Error('List name is required.');}
        if(listName.length>15) {throw Error('large input.')}
        const newList = {
            _id:mongoose.Types.ObjectId(),
            name:listName,
            tasks:[]
        }
        await User.findOneAndUpdate({_id:userID},{$push:{lists:newList}},{useFindAndModify:false});
        res.status(201).json({listID:newList._id});
    } catch (err) {
        let errors;
        if(err.message === 'List name is required.') {
            errors='List name is required'
        } else if(err.message === 'large input.') {
            errors='List name is too large'
        } else {
            errors="Something went wrong"
        }
        res.status(400).json({error:errors})
    }
}

module.exports.deleteList_post = async (req,res) => {
    const {userID,listID} = req.body;
    try {
        await User.findOneAndUpdate({_id:userID},{$pull:{lists:{_id:listID}}},{useFindAndModify:false});
        res.status(200).json({message:'Success'});
    } catch (err) {
        res.status(400).json({error:err.message});
    }
}

module.exports.list_get = async (req,res) => {
    const {userID,listID} = req.params;
    const user = await User.findById({_id:userID});
    if(!user) {
        res.status(404).redirect('/404');
    } else {
        let found = false;
        user.lists.forEach(list => {
            if(list._id.toString() === listID.toString()) {
                found = true;
                res.render('list',{tasks:list.tasks,listName:list.name,userID,listID});
            }
        });
        if(!found) res.status(404).redirect('/404');
    }
}

module.exports.entertask_post = async (req,res) => {
    const {task,userID,listID} = req.body;
    try {
        if(task.length === 0) {
            throw new Error('Task cannot be empty!!');
        }
        const taskID = mongoose.Types.ObjectId();
        const Task = {
            _id:taskID,
            task:task,
            checked:false
        }
        await User.findOneAndUpdate({_id:userID,'lists._id':listID},{$push:{'lists.$.tasks':Task}},{useFindAndModify:false});
        res.status(201).json({taskID:taskID});
    } catch (err) {
        res.status(400).json({error:err.message});
    }
}

module.exports.checkbox_post = async (req,res) => {
    const {userID,listID,taskID,checked} = req.body;
    try {
        await User.findOneAndUpdate({_id:userID},
            {$set:{'lists.$[i].tasks.$[j].checked':checked}},{arrayFilters:[{
                'i._id':listID,
                }, {
                'j._id':taskID
                }],useFindAndModify:false});
        res.status(201).json({message:'ok'});

    } catch (err) {
        res.status(400).json({error:err.message});
    }
}

module.exports.clearcompletedtasks_post = async (req,res) => {
    const {deleteTaskIDs,userID,listID} = req.body;
    try {
        if(deleteTaskIDs.length === 0) {
            throw new Error('Complete at least one task')
        }
        for(let i = 0;i<deleteTaskIDs.length;i++) {
            const taskID = deleteTaskIDs[i];
            await User.findOneAndUpdate({_id:userID},
                {$pull:{'lists.$[i].tasks':{_id:taskID}}},{arrayFilters:[{
                        'i._id':listID,
                    }],useFindAndModify:false});
        }
        res.status(201).json({message:'success'});
    }catch (err) {
        res.status(400).json({error:err.message});
    }
}

