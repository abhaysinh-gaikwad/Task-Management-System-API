// routes/employee.route.js
const express = require("express");
require("dotenv").config();
const { TaskModel } = require("../model/task.model");
const { auth } = require("../middleware/auth");

const taskRouter = express.Router();

taskRouter.post("/", auth, async (req, res) => {
    try{
        const payload = req.body;
        payload.user_id = req.user._id;
        const task = new TaskModel(payload);
        await task.save();
        res.send({ msg: "Task created successfully", task });
    }
    catch(err){
        console.error(err);
        res.status(500).send({ error: "Error while creating task" });
    }
});

taskRouter.get("/", auth, async (req, res) => {
    try {
        const tasks = await TaskModel.find({ user_id: req.user._id });
        res.send(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error while fetching tasks" });
    }   
});

taskRouter.get("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const task = await TaskModel.findById({ _id: id });
        if (task) {
            res.send(task);
        } else {
            res.status(404).send({ msg: "Task not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error while fetching task" });
    }
});

taskRouter.patch("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const task = await TaskModel.findByIdAndUpdate({ _id: id }, payload);
        if (task) {
            res.send({ msg: "Task updated successfully", task  });
        } else {
            res.status(404).send({ msg: "Task not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error while updating task" });
    }
});

taskRouter.delete("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const task = await TaskModel.findByIdAndDelete({ _id: id });
        if (task) {
            res.send({ msg: "Task deleted successfully", task });
        } else {
            res.status(404).send({ msg: "Task not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error while deleting task" });
    }
});
module.exports = {
    taskRouter,
};
