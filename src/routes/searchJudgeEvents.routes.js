const { Router } = require("express");

const SearchJudgeEventsController = require ("../controllers/SearchJudgeEventsController");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const SearchJudgeEventsRoutes = Router();

const searchJudgeEventsController = new SearchJudgeEventsController();

SearchJudgeEventsRoutes.get("/", searchJudgeEventsController.index);

module.exports = SearchJudgeEventsRoutes;