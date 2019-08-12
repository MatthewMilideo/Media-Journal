const Router = require("express-promise-router");

const db = require("../db/index.js");
const Notes_TagController = require('../controllers/notes_tag_cont');

const router = new Router();

router.get('/', Notes_TagController.findAll);
router.get('/note/', Notes_TagController.findByNID);
router.get('/tag/', Notes_TagController.findByTID);
router.get('/both/', Notes_TagController.findNT);
router.post('/', Notes_TagController.postNT);
router.delete('/', Notes_TagController.deleteNT);


module.exports = router;


