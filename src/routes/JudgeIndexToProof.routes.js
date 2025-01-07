const { Router } = require("express");

const JudgeIndexToProofController = require ("../controllers/JudgeIndexToProofController");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const JudgeIndexToProofRoutes = Router();

const judgeIndexToProofController = new JudgeIndexToProofController();

JudgeIndexToProofRoutes.get("/", judgeIndexToProofController.index);
//JudgeIndexToProofRoutes.get("/:id", presentersIndexToHorseController.show);

module.exports = JudgeIndexToProofRoutes;