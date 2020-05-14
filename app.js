const express = require("express");
const morgan = require("morgan");
const partnerRouter = require("./routes/partnerRoutes");
const discontController = require("./routes/discontRoutes");
const userController = require("./controllers/userController");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(express.json());
app.use("/api/v1/partners", partnerRouter);
app.use("/api/v1/disconts", discontController);
app.use("/api/v1/users", userController);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
