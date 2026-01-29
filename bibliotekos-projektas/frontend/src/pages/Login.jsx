import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = ({ setUser }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/api/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify({ username: res.data.username, role: res.data.role }));
            setUser({ username: res.data.username, role: res.data.role });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Prisijungti nepavyko');
        }
    };

    return (
        <div className="auth-form animate-fade">
            <div className="glass-card">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Prisijungimas</h2>
                {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <label>Vartotojo vardas</label>
                    <input
                        type="text"
                        placeholder="Pvz. andrius123"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                    />
                    <label>Slaptažodis</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
                        <LogIn size={20} /> Prisijungti
                    </button>
                </form>
                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    Neturite paskyros? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Registruotis</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
