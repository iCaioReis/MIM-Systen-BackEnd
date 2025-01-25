const { Router } = require("express");

const sessionsRouter = require("./sessions.routes");

const usersRouter = require("./users.routes");
const presentersRouter = require("./presenters.routes");
const presentersIndexToHorseRouter = require("./presentersIndexToHorse.routes");
const horsesRouter = require("./horses.routes");
const seasonsRouter = require("./seasons.routes");
const judgeIndexToProofRouter = require("./judgeIndexToProof.routes");
const eventsRouter = require("./events.routes");
const searchActiveHosesRouter = require("./searchActiveHoses.routes");
const searchJudgeEventsRouter = require("./searchJudgeEvents.routes");
const searchActiveSeasonsRouter = require("./searchActiveSeasons.routes");
const horsePresenterEventRouter = require("./horsePresenterEvent.routes")
const judgeHorsePresenterEventRouter = require("./judgeHorsePresenterEvent.routes")
const finishEventRegistrationsRouter = require("./finishEventRegistrations.routes")
const resultsRouter = require("./results.routes")

const saveChampionOfChampionsRouter = require("./saveChampionOfChampions.routes")

const avatarRouter = require("./avatar.routes");

const routes = Router();

routes.use("/sessions", sessionsRouter);

routes.use('/users', usersRouter);
routes.use('/presenters', presentersRouter);
routes.use('/presentersIndexToHorse', presentersIndexToHorseRouter);
routes.use('/horses', horsesRouter);
routes.use('/seasons', seasonsRouter);
routes.use('/judgeIndexToProof', judgeIndexToProofRouter);
routes.use('/searchActiveHoses', searchActiveHosesRouter);
routes.use('/searchJudgeEvents', searchJudgeEventsRouter);
routes.use('/searchActiveSeasons', searchActiveSeasonsRouter);

routes.use('/avatar', avatarRouter);
routes.use('/events', eventsRouter);
routes.use('/horsePresenterEvent', horsePresenterEventRouter);
routes.use('/judgeHorsePresenterEvent', judgeHorsePresenterEventRouter);
routes.use('/finishEventRegistrations', finishEventRegistrationsRouter);

routes.use('/saveChampionOfChampions', saveChampionOfChampionsRouter);
routes.use('/results', resultsRouter);

module.exports = routes;