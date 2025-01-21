const { Router } = require("express");

const FinishEventRegistrationsController = require ("../controllers/FinishEventRegistrationsController");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const FinishEventRegistrationsRoutes = Router();

const finishEventRegistrationsController = new FinishEventRegistrationsController();

FinishEventRegistrationsRoutes.put("/:id", finishEventRegistrationsController.update);

module.exports = FinishEventRegistrationsRoutes;