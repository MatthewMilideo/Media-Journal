const Router = require("express-promise-router");

const db = require("../db/index.js");
const usersController = require('../controllers/users_cont');

const router = new Router();

router.get('/', usersController.findAll);
router.get('/:user_id', usersController.findByID);
router.post('/name', usersController.findByUsername);
router.post('/email', usersController.findByEmail);
router.post('/login', usersController.login);
router.post('/register', usersController.register);
router.put('/:user_id', usersController.editUser);
router.delete('/:user_id', usersController.deleteUser);

module.exports = router;