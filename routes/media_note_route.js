const Router = require("express-promise-router");
const Media_UserController = require('../controllers/media_user_cont');

const router = new Router();

//router.get('/', Media_UserController.getAlllMN);
//router.get('/media', Media_UserController.getMediaMN);
//router.get('/note', Media_UserController.getNoteMN);
router.post('/', Media_UserController.postMN);
//router.delete('/', Media_UserController.deleteMN);

module.exports = router;

