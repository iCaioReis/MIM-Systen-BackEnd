const { Router } = require("express");

const SearchActiveHorsesController = require ("../controllers/SearchActiveHorsesController");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const SearchActiveHorsesRoutes = Router();

const searchActiveHorsesController = new SearchActiveHorsesController();

SearchActiveHorsesRoutes.get("/", searchActiveHorsesController.index);
//SearchActiveHorsesRoutes.get("/:id", presentersIndexToHorseController.show);

module.exports = SearchActiveHorsesRoutes;