const express = require("express");
const router = express.Router();
const aiController = require("../../controllers/ai.js");
const wrapAsync = require("../../utils/wrapAsync.js");

router.route("/plan")
    .get(aiController.renderPlanForm)
    .post(wrapAsync(aiController.generatePlan));

module.exports = router;
