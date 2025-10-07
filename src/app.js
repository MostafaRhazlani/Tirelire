require('dotenv').config();

const express = require('express');

const app = express();

// routes
app.use('/', (req, res) => {
    res.send('hello express');
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log('app is running on port:', PORT));