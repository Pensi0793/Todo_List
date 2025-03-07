import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoList = ({ token, setToken }) => {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/api/todos', { headers: { Authorization: token } })
            .then(res => setTodos(res.data));
    }, [token]);

    const addTodo = async (e) => {
        e.preventDefault();
        const { data } = await axios.post('http://localhost:5000/api/todos', { title }, { headers: { Authorization: token } });
        setTodos([...todos, data]);
        setTitle('');
    };

    const deleteTodo = async (id) => {
        await axios.delete(`http://localhost:5000/api/todos/${id}`, { headers: { Authorization: token } });
        setTodos(todos.filter(todo => todo._id !== id));
    };

    const toggleTodo = async (id, completed) => {
        const { data } = await axios.put(`http://localhost:5000/api/todos/${id}`, { completed: !completed }, { headers: { Authorization: token } });
        setTodos(todos.map(todo => todo._id === id ? data : todo));
    };

    return (
        <div>
            <button onClick={() => { setToken(null); localStorage.removeItem('token'); }}>Logout</button>
            <h2>Todo List</h2>
            <form onSubmit={addTodo}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New todo" />
                <button type="submit">Add</button>
            </form>
            <ul>
                {todos.map(todo => (
                    <li key={todo._id}>
                        <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo._id, todo.completed)} />
                        {todo.title}
                        <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;