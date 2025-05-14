import { AuthContext } from '@/context/AuthContext';
import React, { useState, useEffect, useContext } from 'react';

function Login() {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        students: 247,
        faculty: 32,
        staff: 18
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                students: Math.max(0, prev.students + Math.floor(Math.random() * 5) - 2),
                faculty: prev.faculty,
                staff: prev.staff
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (username === 'admin' && password === 'password') {
                setTimeout(() => {
                    login({ username, role: 'admin', name: 'Admin User' }, 'fake-jwt-token-12345');
                    setLoading(false);
                }, 1000);
            } else if (username === 'staff' && password === 'password') {
                setTimeout(() => {
                    login({ username, role: 'staff', name: 'Staff Member' }, 'fake-jwt-token-67890');
                    setLoading(false);
                }, 1000);
            } else {
                throw new Error('Invalid username or password. (Hint: admin/password or staff/password)');
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #3a36e1 0%, #5f34b3 100%)' }}> {/* login-bg */}
            <div className="rounded-xl p-8 w-full max-w-md shadow-xl" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)'}}> {/* glass-card */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <img src="/iiitkota.webp" alt="IIIT Kota Logo" className="h-16 w-auto" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">IIIT Kota</h1>
                    <p className="text-gray-600 mt-2">Campus Presence System</p>
                    
                    <div className="mt-6 bg-indigo-50 rounded-lg p-4">
                        <div className="text-lg font-semibold text-indigo-800 mb-3">Current Campus Presence</div>
                        <div className="flex justify-around items-center">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600">{stats.students}</div>
                                <div className="text-sm text-blue-500">Students</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-indigo-600">{stats.faculty}</div>
                                <div className="text-sm text-indigo-500">Faculty</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600">{stats.staff}</div>
                                <div className="text-sm text-purple-500">Staff</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm" role="alert">
                            {error}
                        </div>
                    )}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                            required 
                            placeholder="admin or staff"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                            required 
                            placeholder="password"
                        />
                    </div>
                    <div>
                        <button 
                            type="submit" 
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'Sign in'}
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center text-xs text-gray-500"> {/* Adjusted text color for better contrast on glass */}
                    <p>© {new Date().getFullYear()} IIIT Kota. All rights reserved.</p>
                    <p className="mt-1">For demonstration purposes only.</p>
                </div>
            </div>
        </div>
    );
}

export default Login;