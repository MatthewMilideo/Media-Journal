const Router = require("express-promise-router");

const SearchController = require("../controllers/search_cont");

const router = new Router();

router.get("/", SearchController.search);
router.get("/item/", SearchController.getItem);
router.get("/notes/", SearchController.getNotesMedia);

module.exports = router;
