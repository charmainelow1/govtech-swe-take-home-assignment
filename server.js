import express from 'express';
import path from 'path';
import users from './routes/users.js'
const port = process.env.PORT || 8000;

const app = express();

app.use('/', users);

app.listen(port, () => console.log(`Server running on port ${port}`));