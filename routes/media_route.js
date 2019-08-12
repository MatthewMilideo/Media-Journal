const Router = require("express-promise-router");
const MediaController = require('../controllers/media_cont');
const router = new Router();

router.get('/', MediaController.getAllMedia);
router.get('/user/', MediaController.getUserMedia);
//router.get('/content/', MediaController.getCIDMedia);
//router.post('/', MediaController.postMedia);
//router.put('/', MediaController.editMedia);
//router.delete('/', MediaController.deleteMedia);

module.exports = router;


