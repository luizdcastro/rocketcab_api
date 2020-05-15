const express = require("express");
const morgan = require("morgan");
const partnerRouter = require("./routes/partnerRoutes");
const discontRouter = require("./routes/discontRoutes");
const userRouter = require("./routes/userRoutes");
const favoriteRouter = require("./routes/favoriteRoutes");
const cardRouter = require("./routes/cardRoutes");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// Routes
app.use(express.json());
app.use("/api/v1/partners", partnerRouter);
app.use("/api/v1/disconts", discontRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/favorites", favoriteRouter);
app.use("/api/v1/cards", cardRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
