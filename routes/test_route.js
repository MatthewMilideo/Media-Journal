const Router = require("express-promise-router");
const TestController = require('../controllers/test_cont');

const router = new Router();

router.get('/', TestController.searchPage);


module.exports = router;


