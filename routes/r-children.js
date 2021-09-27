const { Router } = require("express");
const router = Router();
const childrenController = require("../controllers/con-children");

router.get("/:id", childrenController.getChildrenDetails);
router.post("/create", childrenController.addChild);
router.put("/:id", childrenController.updateChildrenDetails);
router.delete("/:id", childrenController.deleteChild);

module.exports = router;
