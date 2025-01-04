const { Router } = require("express");
//const multer = require ("multer");
//const uploadConfig = require("../configs/upload");

const PresentersController = require ("../controllers/PresentersController");
//const PresenterAvatarContoller = require ("../controllers/PresenterAvatarContoller");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const presentersRoutes = Router();
//const upload = multer(uploadConfig.MULTER);

const presentersController = new PresentersController();
//const presenterAvatarContoller = new PresenterAvatarContoller();

presentersRoutes.post("/", presentersController.create);
presentersRoutes.get("/", presentersController.index);
presentersRoutes.get("/:id", presentersController.show);
presentersRoutes.put("/:id", presentersController.update);

//presentersRoutes.put("/", ensureAuthenticated, presentersController.update)
//presentersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), presenterAvatarContoller.update)

module.exports = presentersRoutes;