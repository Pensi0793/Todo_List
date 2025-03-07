import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ setToken }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Thêm state để hiển thị lỗi

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin ? '/api/auth/login' : '/api/auth/register';
        try {
            const { data } = await axios.post(`http://localhost:5000${url}`, { username, password });
            setToken(data.token);
            localStorage.setItem('token', data.token);
            setError(''); // Xóa lỗi nếu thành công
        } catch (error) {
            setError(error.response?.data?.msg || 'Network Error'); // Hiển thị thông báo lỗi
            console.error('Axios error:', error.message);
        }
    };

    return (
        <div>
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Hiển thị lỗi */}
            <form onSubmit={handleSubmit}>
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
                Switch to {isLogin ? 'Register' : 'Login'}
            </button>
        </div>
    );
};

export default Auth;