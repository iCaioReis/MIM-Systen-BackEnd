const { Router } = require("express");

const SearchActiveSeasonsController = require ("../controllers/SearchActiveSeasonsController");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const SearchActiveSeasonsRoutes = Router();

const searchActiveSeasonsController = new SearchActiveSeasonsController();

SearchActiveSeasonsRoutes.get("/", searchActiveSeasonsController.index);
//SearchActiveSeasonsRoutes.get("/:id", presentersIndexToHorseController.show);

module.exports = SearchActiveSeasonsRoutes;