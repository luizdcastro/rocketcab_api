const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const partnerRouter = require('./routes/partnerRoutes');
const userRouter = require('./routes/userRoutes');
const discontRouter = require('./routes/discontRoutes');
const filesRouter = require('./routes/filesRoute');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const path = require('path');
const AppError = require('./utils/appError');


const app = express();
app.set('view engine', 'pug');

// Global middlewares
// Set security HTTP headers
app.use(helmet());
app.use(cors());

// Development loggin
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same API
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '1kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Static data
app.use(
  '/files',
  express.static(path.resolve(__dirname, '.', 'tmp', 'uploads'))
);

// Data sanitizations agains XSS
app.use(xss());
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['category', 'product'],
  })
);

// Routes
app.use('/api/v1/partners', partnerRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/disconts', discontRouter);
app.use('/api/v1/files', filesRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

// Populate favorite list with partner:
// Name
// Category
// Address

// Pupulate card list with partner and discont:
// Partner name
// Address
// Discont name
// Discont percentage
