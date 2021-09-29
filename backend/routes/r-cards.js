const { Router } = require("express");
const router = Router();
const cardController = require("../controllers/con-cards");

router.get('/list/:childid', cardController.getCardsByChildren)
router.get("/:cardId", cardController.getCardDetails);
router.post("/create", cardController.addCardDetails);
router.put("/:cardId", cardController.updateCardDetails);
router.delete("/:cardId", cardController.removeCard);

module.exports = router;
