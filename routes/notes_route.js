const Router = require("express-promise-router");

const db = require("../db/index.js");
const NotesController = require('../controllers/notes_cont');

const router = new Router();

router.get('/', NotesController.getAllNotes);
router.get('/user/', NotesController.getUserNotes);
router.get('/media/', NotesController.getMediaNotes);
router.get('/mediauser', NotesController.getMediaUserNotes);
router.post('/', NotesController.postNote);
router.put('/', NotesController.editNote);

router.delete('/:note_id', NotesController.deleteNote);


module.exports = router;


