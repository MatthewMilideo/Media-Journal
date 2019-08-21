const Router = require("express-promise-router");
const TestController = require('../controllers/test_cont');

const router = new Router();

router.get('/TMDB/', TestController.searchTMDB);

module.exports = router;


