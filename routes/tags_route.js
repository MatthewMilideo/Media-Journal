const Router = require("express-promise-router");

const db = require("../db/index.js");
const TagController = require('../controllers/tags_cont');

const router = new Router();

router.get('/', TagController.findAll);
router.get('/:tag_id', TagController.findByID);
router.post('/', TagController.postTag);
router.delete('/:tag_id', TagController.deleteTag);


module.exports = router;


