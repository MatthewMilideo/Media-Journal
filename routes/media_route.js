const Router = require("express-promise-router");

const MediaController = require('../controllers/media_cont');
const router = new Router();

router.get('/', MediaController.getAllMedia);
router.get('/CID/', MediaController.getMediaCID);
router.post('/', MediaController.postMedia);
//router.put('/', MediaController.editMedia);
router.delete('/', MediaController.deleteMedia);

module.exports = router;


