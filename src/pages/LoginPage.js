import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_KEY } from '../contants/api';
import { useDispatch } from 'react-redux';
import { setSessionId, setUser } from '../store/userSlice';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 1. Get request token
            const { data: { request_token } } = await axios.get(`/authentication/token/new?api_key=${API_KEY}`);

            // 2. Validate request token with login
            await axios.post(`/authentication/token/validate_with_login?api_key=${API_KEY}`, {
                username: email,
                password: password,
                request_token: request_token,
            });

            // 3. Create session ID
            const { data: { session_id } } = await axios.post(`/authentication/session/new?api_key=${API_KEY}`, {
                request_token: request_token,
            });

            dispatch(setSessionId(session_id));

            // 4. Get account details
            const { data: accountDetails } = await axios.get(`/account?api_key=${API_KEY}&session_id=${session_id}`);
            dispatch(setUser(accountDetails));

            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Failed to login. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Username
                        </label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Sign In
                        </button>
                        <Link to="/signup" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                            Don't have an account?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
