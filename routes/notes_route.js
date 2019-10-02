const Router = require("express-promise-router");

const NotesController = require("../controllers/notes_cont");

const router = new Router();

router.post("/media_user/", NotesController.postMediaUser);

router.post("/", NotesController.postNote);
router.put("/", NotesController.editNote);
router.delete("/", NotesController.deleteMN);
router.delete("/media_user/", NotesController.deleteMediaUser);

module.exports = router;
