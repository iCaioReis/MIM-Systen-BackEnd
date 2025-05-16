const { Router } = require("express");

const SeasonPointsController = require ("../controllers/SeasonPointsController");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const seasonPointsRouter = Router();

const seasonPointsController = new SeasonPointsController();

seasonPointsRouter.get("/:id", seasonPointsController.show);

module.exports = seasonPointsRouter;