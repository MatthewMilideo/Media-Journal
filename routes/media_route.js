const Router = require("express-promise-router");

const db = require("../db/index.js");
const MediaController = require('../controllers/media_cont');

const router = new Router();

router.get('/', MediaController.findAll);
router.get('/content/', MediaController.findByCID);
router.get('/:media_id', MediaController.findByMID);
router.post('/', MediaController.postMedia);
router.delete('/content/', MediaController.deleteMediaByCID);
router.delete('/:media_id', MediaController.deleteMedia);


module.exports = router;


