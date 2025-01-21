const { Router } = require("express");

const JudgeHorsePresenterEventController = require ("../controllers/JudgeHorsePresenterEventController");

const judgeHorsePresenterEventRoutes = Router();

const judgeHorsePresenterEventController = new JudgeHorsePresenterEventController();

judgeHorsePresenterEventRoutes.get("/:id", judgeHorsePresenterEventController.show);
//judgeHorsePresenterEventRoutes.put("/:id", judgeHorsePresenterEventController.update);

module.exports = judgeHorsePresenterEventRoutes;  