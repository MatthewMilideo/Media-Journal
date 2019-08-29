const Router = require("express-promise-router");
const db = require("../db/index.js");
const Media_UserController = require('../controllers/media_user_cont');

const router = new Router();

router.get('/', Media_UserController.getAllMU);
router.get('/media/', Media_UserController.getMedia);
router.get('/user/', Media_UserController.getUsers);
router.get('/media_user/', Media_UserController.getMU);
router.post('/', Media_UserController.postMediaUser);
router.delete('/', Media_UserController.deleteMU);

module.exports = router;


