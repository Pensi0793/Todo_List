const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Todo = require('../models/Todo');

const auth = (req, res, next) => {
    const token = req.header('Authorization');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
};

router.get('/', auth, async (req, res) => {
    const todos = await Todo.find({ userId: req.user.id });
    res.json(todos);
});

router.post('/', auth, async (req, res) => {
    const todo = new Todo({ userId: req.user.id, title: req.body.title });
    await todo.save();
    res.json(todo);
});

router.delete('/:id', auth, async (req, res) => {
    await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ msg: 'Deleted' });
});

router.put('/:id', auth, async (req, res) => {
    const todo = await Todo.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { completed: req.body.completed },
        { new: true }
    );
    res.json(todo);
});

module.exports = router;