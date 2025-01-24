const { Router } = require("express");

const SaveChampionOfChampionsController = require ("../controllers/SaveChampionOfChampionsController");

const saveChampionOfChampionsRoutes = Router();

const saveChampionOfChampionsController = new SaveChampionOfChampionsController();

saveChampionOfChampionsRoutes.put("/", saveChampionOfChampionsController.update);

module.exports = saveChampionOfChampionsRoutes;