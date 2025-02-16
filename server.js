import express from 'express';
import path from 'path';
import users from './routes/users.js'
import upload from './routes/upload.js'
import logger from './middleware/logger.js'
import errorHandler from './middleware/error.js';
import notFound from './middleware/notFound.js';
const port = process.env.PORT || 8000;

const app = express();

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//logger middleware
app.use(logger);

//routes
app.use('/', users);
app.use('/', upload);

//error handler
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));