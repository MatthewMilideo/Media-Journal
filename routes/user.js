const Router = require("express-promise-router");
const db = require("../db/index.js");

var usersController = require('../controllers/users_cont');

const router = new Router();
module.exports = router;


router.get('/', usersController.findAll);
router.get('/:user_id', usersController.findByID);
router.post('/', usersController.postUser);
router.put('/:user_id', usersController.editUser);
router.delete('/:user_id', usersController.deleteUser);
