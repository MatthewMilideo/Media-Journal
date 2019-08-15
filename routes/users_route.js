const Router = require("express-promise-router");
const usersController = require('../controllers/users_cont');

const router = new Router();

router.get('/', usersController.getAllUsers);
router.get('/user_id', usersController.getUserID);
router.get('/email', usersController.getUserEmail);
router.post('/', usersController.postUser);
router.put('/', usersController.editUser);
router.delete('/', usersController.deleteUser);

module.exports = router;