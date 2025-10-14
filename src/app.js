require('dotenv').config();

const express = require('express');
const Database = require('./config/connection');
const userRoutes = require('./routes/user.routes');
const groupRoutes = require('./routes/group.routes');

const app = express();
app.use(express.json());

// routes
app.use('/api', userRoutes);
app.use('/api', groupRoutes);

Database.connect();

const PORT = process.env.PORT;
app.listen(PORT, () => console.log('app is running on port:', PORT));