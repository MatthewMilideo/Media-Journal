const Router = require("express-promise-router");

const db = require("../db/index.js");
const Note_TagController = require('../controllers/notes_tag_cont');

const router = new Router();

router.get('/', Note_TagController.getAllNT);
router.get('/note/', Note_TagController.getNoteNT);
router.get('/tag/', Note_TagController.getTagNT);
router.post('/', Note_TagController.postNT);
router.delete('/', Note_TagController.deleteNT);


module.exports = router;


