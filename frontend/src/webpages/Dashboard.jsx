import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styling/Dashboard.css';

const Dashboard = () => {
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chores, setChores] = useState([]);
    const [utilities, setUtilities] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_API_URL}/user/status`, { withCredentials: true })
            .then(res => {
                setEmail(res.data.username);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!email) return;
        axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/chores/user/me`, { withCredentials: true })
            .then(res => setChores(res.data || []))
            .catch(() => {});
        axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/utility/user/me`, { withCredentials: true })
            .then(res => setUtilities(res.data || []))
            .catch(() => {});
    }, [email]);

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner spinner-lg"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    const upcomingChores = chores.slice(0, 5);
    const upcomingUtilities = utilities.slice(0, 5);

    return (
        <div className="dashboard-container">
            {/* Dashboard Header */}
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Welcome back, {email}</p>
            </div>

            {/* Stats Overview */}
            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-value">{chores.length}</div>
                    <div className="stat-label">Pending Chores</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-value">{utilities.length}</div>
                    <div className="stat-label">Upcoming Bills</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🏠</div>
                    <div className="stat-value">—</div>
                    <div className="stat-label">Active Rooms</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">✓</div>
                    <div className="stat-value">—</div>
                    <div className="stat-label">Completed This Week</div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-content">
                {/* Upcoming Chores */}
                <div className="dashboard-section">
                    <h3>Upcoming Chores</h3>
                    {upcomingChores.length > 0 ? (
                        <ul>
                            {upcomingChores.map((chore, index) => (
                                <li key={index}>
                                    <div className="item-icon">📋</div>
                                    <div className="item-content">
                                        <div className="item-title">{chore.name || chore.title || 'Untitled Chore'}</div>
                                        <div className="item-meta">
                                            {chore.dueDate ? `Due: ${new Date(chore.dueDate).toLocaleDateString()}` : 'No due date'}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No upcoming chores. You're all caught up! 🎉</p>
                    )}
                </div>

                {/* Upcoming Utilities */}
                <div className="dashboard-section">
                    <h3>Upcoming Bills</h3>
                    {upcomingUtilities.length > 0 ? (
                        <ul>
                            {upcomingUtilities.map((utility, index) => (
                                <li key={index}>
                                    <div className="item-icon">💰</div>
                                    <div className="item-content">
                                        <div className="item-title">{utility.name || utility.title || 'Untitled Bill'}</div>
                                        <div className="item-meta">
                                            {utility.dueDate ? `Due: ${new Date(utility.dueDate).toLocaleDateString()}` : 'No due date'}
                                            {utility.amount && ` • $${utility.amount}`}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No upcoming bills. All caught up! 💸</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
