const { Router } = require("express");

const HorsePresenterEventController = require ("../controllers/HorsePresenterEventController");

const horsePresenterEventRoutes = Router();

const horsePresenterEventController = new HorsePresenterEventController();

horsePresenterEventRoutes.post("/", horsePresenterEventController.create);
//horsePresenterEventRoutes.get("/", horsePresenterEventController.index);
horsePresenterEventRoutes.get("/:id", horsePresenterEventController.show);
horsePresenterEventRoutes.delete("/:id", horsePresenterEventController.delete);
//horsePresenterEventRoutes.put("/:id", horsePresenterEventController.update);

module.exports = horsePresenterEventRoutes;  