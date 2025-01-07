const { Router } = require("express");
//const multer = require ("multer");
//const uploadConfig = require("../configs/upload");

const SeasonsController = require ("../controllers/SeasonsController");
//const SeasonAvatarContoller = require ("../controllers/SeasonAvatarContoller");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const seasonsRoutes = Router();
//const upload = multer(uploadConfig.MULTER);

const seasonsController = new SeasonsController();
//const seasonAvatarContoller = new SeasonAvatarContoller();

seasonsRoutes.post("/", seasonsController.create);
seasonsRoutes.get("/", seasonsController.index);
seasonsRoutes.get("/:id", seasonsController.show);
seasonsRoutes.put("/:id", seasonsController.update);
seasonsRoutes.delete("/:id", seasonsController.delete);

//seasonsRoutes.put("/", ensureAuthenticated, seasonsController.update)
//seasonsRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), seasonAvatarContoller.update)

module.exports = seasonsRoutes;