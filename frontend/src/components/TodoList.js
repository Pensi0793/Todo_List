import React, { useState, useEffect } from 'react';
import api from '../api'; // Import instance axios đã cấu hình
import { Button, Checkbox, Form, Input, List, message, Progress } from 'antd';

const TodoList = ({ token, setToken }) => {
  const [todos, setTodos] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const { data } = await api.get('/api/todos', {
          headers: { Authorization: token },
        });
        setTodos(data);
      } catch (error) {
        message.error('Failed to fetch todos');
      }
    };
    if (token) fetchTodos();
  }, [token]);

  const calculateProgress = () => {
    if (todos.length === 0) return 0;
    const completedTodos = todos.filter((todo) => todo.completed).length;
    return Math.round((completedTodos / todos.length) * 100);
  };

  const addTodo = async (values) => {
    try {
      const { data } = await api.post(
        '/api/todos',
        { title: values.title },
        { headers: { Authorization: token } }
      );
      setTodos([...todos, data]);
      form.resetFields();
      message.success('Todo added!');
    } catch (error) {
      message.error('Failed to add todo');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/api/todos/${id}`, {
        headers: { Authorization: token },
      });
      setTodos(todos.filter((todo) => todo._id !== id));
      message.success('Todo deleted!');
    } catch (error) {
      message.error('Failed to delete todo');
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const { data } = await api.put(
        `/api/todos/${id}`,
        { completed: !completed },
        { headers: { Authorization: token } }
      );
      setTodos(todos.map((todo) => (todo._id === id ? data : todo)));
      message.success('Todo updated!');
    } catch (error) {
      message.error('Failed to update todo');
    }
  };

  return (
    <div className="Todo-container">
      <Button
        type="link"
        danger
        onClick={() => {
          setToken(null);
          localStorage.removeItem('token');
        }}
        className="Todo-logout-button"
      >
        Logout
      </Button>
      <h2 className="Todo-title">Todo List</h2>
      
      <Progress
        percent={calculateProgress()}
        status={calculateProgress() === 100 ? 'success' : 'active'}
        className="Todo-progress"
      />

      <Form
        form={form}
        onFinish={addTodo}
        layout="inline"
        className="Todo-form"
      >
        <Form.Item
          name="title"
          rules={[{ required: true, message: 'Please input a todo!' }]}
        >
          <Input placeholder="Add a new todo" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form.Item>
      </Form>

      <List
        className="Todo-list"
        dataSource={todos}
        renderItem={(todo) => (
          <List.Item
            actions={[
              <Button type="link" danger onClick={() => deleteTodo(todo._id)}>
                Delete
              </Button>,
            ]}
          >
            <Checkbox
              checked={todo.completed}
              onChange={() => toggleTodo(todo._id, todo.completed)}
            >
              {todo.completed ? <strike>{todo.title}</strike> : todo.title}
            </Checkbox>
          </List.Item>
        )}
      />
    </div>
  );
};

export default TodoList;