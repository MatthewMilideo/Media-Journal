const Router = require("express-promise-router");

const SearchController = require('../controllers/search_cont');

const router = new Router();

router.get('/TMDB/', SearchController.searchTMDB);
router.get('/books/', SearchController.searchGBooks);
router.get('/item/', SearchController.getItem);

module.exports = router;


