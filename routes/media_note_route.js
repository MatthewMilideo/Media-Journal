const Router = require("express-promise-router");
const Media_NoteController = require('../controllers/media_note_cont');

const router = new Router();

router.get('/', Media_NoteController.getAllMN);
router.get('/media', Media_NoteController.getMediaMN);
router.get('/note', Media_NoteController.getNoteMN);
router.post('/', Media_NoteController.postMN);
router.delete('/', Media_NoteController.deleteMN);

module.exports = router;

