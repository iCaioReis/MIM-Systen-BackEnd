const { Router } = require("express");

const PresentersIndexToHorseController = require ("../controllers/PresentersIndexToHorseController");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const PresentersIndexToHorseRoutes = Router();

const presentersIndexToHorseController = new PresentersIndexToHorseController();

PresentersIndexToHorseRoutes.get("/", presentersIndexToHorseController.index);
//PresentersIndexToHorseRoutes.get("/:id", presentersIndexToHorseController.show);

module.exports = PresentersIndexToHorseRoutes;