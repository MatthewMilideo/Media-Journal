const Router = require("express-promise-router");

const NotesController = require("../controllers/notes_cont");

const router = new Router();

router.post("/", NotesController.postUser);

module.exports = router;
