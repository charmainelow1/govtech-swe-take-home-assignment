import express from 'express';
import path from 'path';
import users from './routes/users.js'
import logger from './middleware/logger.js'
const port = process.env.PORT || 8000;

const app = express();

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//logger middleware
app.use(logger);

app.use('/', users);

app.listen(port, () => console.log(`Server running on port ${port}`));