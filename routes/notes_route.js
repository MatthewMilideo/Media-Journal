const Router = require("express-promise-router");

const NotesController = require("../controllers/notes_cont");

const router = new Router();

router.post("/", NotesController.postNote);
router.put("/", NotesController.editNote);
router.delete("/", NotesController.deleteMN);

module.exports = router;
