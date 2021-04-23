const express = require('express')
const router = express.Router();
const controller = require('../controllers/controllers');
const {authUser,alreadyLoggedIn,checkSameUser} = require('../middlewares/auth');


router.get('/',controller.home);
router.get('/logout',controller.logout_get);
router.get('/list/:userID/:listID',authUser,checkSameUser,controller.list_get);
router.get('/dashboard',authUser,controller.dashboard_get);
router.get('/404',controller.pagenotfound_get);
router.post('/entertask',controller.entertask_post);
router.post('/createList',controller.createList_post);
router.post('/deleteList',controller.deleteList_post);
router.post('/checkbox',controller.checkbox_post);
router.post('/clearcompletedtasks',controller.clearcompletedtasks_post);
router.route('/login').get(alreadyLoggedIn,controller.login_get).post(controller.login_post);
router.route('/signup').get(controller.signup_get).post(controller.signup_post);
router.get('*',controller.pagenotfound_get)


module.exports = router;