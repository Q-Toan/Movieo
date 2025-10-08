import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_KEY } from '../contants/api';
import { useDispatch } from 'react-redux';
import { setSessionId, setUser } from '../store/userSlice';
import { showToast } from '../store/toastSlice';
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import { Lock, Mail } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('luquoctoan');
    const [password, setPassword] = useState('3522601399');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        const savedPassword = localStorage.getItem('rememberedPassword');
        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data: { request_token } } = await axios.get(`/authentication/token/new?api_key=${API_KEY}`);
            await axios.post(`/authentication/token/validate_with_login?api_key=${API_KEY}`, {
                username: email,
                password: password,
                request_token: request_token,
            });

            const { data: { session_id } } = await axios.post(`/authentication/session/new?api_key=${API_KEY}`, {
                request_token: request_token,
            });

            dispatch(setSessionId(session_id));

            const { data: accountDetails } = await axios.get(`/account?api_key=${API_KEY}&session_id=${session_id}`);
            dispatch(setUser(accountDetails));

            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
                localStorage.setItem('rememberedPassword', password);
            } else {
                localStorage.removeItem('rememberedEmail');
                localStorage.removeItem('rememberedPassword');
            }

            dispatch(showToast({ message: "Login successful!", type: "success" }));
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Failed to login. Please check your credentials.');
            dispatch(showToast({ message: "Failed to login. Please check your credentials.", type: "error" }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-4 relative">
            {loading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                    <ClipLoader color="#3b82f6" size={50} />
                </div>
            )}
            <motion.div 
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-neutral-800 p-8 rounded-2xl shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-white">Welcome Back</h2>
                    <p className="text-neutral-400">Sign in to continue to your movie world</p>
                </div>

                {error && 
                    <motion.p 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-500/20 text-red-400 text-center p-3 rounded-lg mb-6"
                    >
                        {error}
                    </motion.p>
                }

                <form onSubmit={handleLogin} className="space-y-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        <label className="text-sm font-medium text-neutral-400" htmlFor="email">
                            Username
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                            <input
                                type="text"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-neutral-700 border border-neutral-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                placeholder="your_username"
                                required
                                disabled={loading}
                            />
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                        <label className="text-sm font-medium text-neutral-400" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <Lock  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-neutral-700 border border-neutral-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                        </div>
                    </motion.div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-400">
                                Remember me
                            </label>
                        </div>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 transform hover:scale-105 disabled:bg-blue-400 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </motion.div>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-neutral-400">
                        Don't have an account? 
                        <Link to="/signup" className="font-medium text-blue-500 hover:text-blue-400">
                             Sign Up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
