require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connection } = require('./config/db');


const app = express();

app.use(express.json());
app.use(cors());

// API routes


app.use('/', (req, res) => {
    res.send({ msg: 'Welcome to Task Management System API' });
});


app.listen(process.env.PORT || 3000, async () => {
    try {
        await connection;
        console.log(`Connected to DB`);
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
        console.log(`http://localhost:${process.env.PORT || 3000}`);
    } catch (err) {
        console.error(err);
    }
});
