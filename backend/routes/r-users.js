const { Router } = require("express");
const router = Router();
const users = require('../controllers/con-users')

router.get('/:id', users.getUserDetails)
router.post('/', users.createUser)
router.get('/:id/childrens', users.getAllChildrens)
module.exports = router;
