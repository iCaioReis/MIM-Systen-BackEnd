const { Router } = require("express");

const EventsSeasonController = require ("../controllers/EventsSeasonController");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const eventsSeasonRouter = Router();

const eventsSeasonController = new EventsSeasonController();

eventsSeasonRouter.get("/:id", eventsSeasonController.show);

module.exports = eventsSeasonRouter;