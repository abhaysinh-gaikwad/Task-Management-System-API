const express = require("express");
const { TaskModel } = require("../model/task.model");
const { auth } = require("../middleware/auth");

const taskRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API endpoints for managing tasks
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - due_date
 *         - user_id
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the task
 *         title:
 *           type: string
 *           description: The title of the task
 *         description:
 *           type: string
 *           description: The description of the task
 *         due_date:
 *           type: string
 *           format: date
 *           description: The due date of the task
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           default: medium
 *           description: The priority of the task
 *         status:
 *           type: string
 *           enum: [pending, in progress, completed]
 *           default: pending
 *           description: The status of the task
 *         created_date:
 *           type: string
 *           format: date-time
 *           description: The date and time when the task was created
 *         user_id:
 *           type: string
 *           description: The ID of the user who owns this task
 *       example:
 *         title: Sample Task
 *         description: This is a sample task
 *         due_date: "2024-06-30"
 *         priority: medium
 *         status: pending
 *         user_id: 60f8d7b4c33a7700158459fd
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       '201':
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       '500':
 *         description: Error while creating task
 */

taskRouter.post("/", auth, async (req, res) => {
    try {
        const payload = req.body;
        payload.user_id = req.user._id;
        const task = new TaskModel(payload);
        await task.save();
        res.status(201).send({ msg: "Task created successfully", task });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error while creating task" });
    }
});

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks of the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       '500':
 *         description: Error while fetching tasks
 */

taskRouter.get("/", auth, async (req, res) => {
    try {
        const tasks = await TaskModel.find({ user_id: req.user._id });
        res.send(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error while fetching tasks" });
    }
});

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task to get
 *     responses:
 *       '200':
 *         description: Task found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       '404':
 *         description: Task not found
 *       '500':
 *         description: Error while fetching task
 */

taskRouter.get("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const task = await TaskModel.findById(id);
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

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       '200':
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       '404':
 *         description: Task not found
 *       '500':
 *         description: Error while updating task
 */

taskRouter.patch("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const task = await TaskModel.findByIdAndUpdate(id, payload, { new: true });
        if (task) {
            res.send({ msg: "Task updated successfully", task });
        } else {
            res.status(404).send({ msg: "Task not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error while updating task" });
    }
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task to delete
 *     responses:
 *       '200':
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       '404':
 *         description: Task not found
 *       '500':
 *         description: Error while deleting task
 */

taskRouter.delete("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const task = await TaskModel.findByIdAndDelete(id);
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
