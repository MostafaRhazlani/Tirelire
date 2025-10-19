require('dotenv').config();

const express = require('express');
const Database = require('./config/connection');
const userRoutes = require('./routes/user.routes');
const groupRoutes = require('./routes/group.routes');
const messageRoutes = require('./routes/message.routes');
const roundRoutes = require('./routes/round.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();
app.use(express.json());

// routes
app.use('/api', userRoutes);
app.use('/api', groupRoutes);
app.use('/api', messageRoutes);
app.use('/api', roundRoutes);
app.use('/api', paymentRoutes);

Database.connect();

const PORT = process.env.PORT;
app.listen(PORT, () => console.log('app is running on port:', PORT));