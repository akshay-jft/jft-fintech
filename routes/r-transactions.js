const { Router } = require("express");
const router = Router();
const transactionController = require('../controllers/con-transactions')

router.post('/checkout', transactionController.checkout)

module.exports = router;