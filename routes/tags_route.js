const Router = require("express-promise-router");

const db = require("../db/index.js");
const TagController = require('../controllers/tags_cont');

const router = new Router();

router.get('/', TagController.getAllTags);
router.get('/ID/', TagController.getTagID);
router.post('/', TagController.postTag);
router.delete('/', TagController.deleteTag);


module.exports = router;


