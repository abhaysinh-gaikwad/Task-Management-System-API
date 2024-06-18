require('dotenv').config();
const express = require('express');
const { connection } = require('./config/db');
const { userRouter } = require('./routes/user.route');
const { taskRouter } = require('./routes/task.route');
const { specs, swaggerUi } = require("./swaggerConfig");


const app = express();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// API routes
app.use('/users',userRouter);
app.use('/tasks', taskRouter);



app.get('/', (req, res) => {
    res.send({ msg: 'Welcome to Task Management System API' });
});


const server =app.listen(process.env.PORT || 3000, async () => {
    try {
        await connection;
        console.log(`Connected to DB`);
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
        console.log(`http://localhost:${process.env.PORT || 3000}`);
    } catch (err) {
        console.error(err);
    }
});

module.exports={
    server
}
