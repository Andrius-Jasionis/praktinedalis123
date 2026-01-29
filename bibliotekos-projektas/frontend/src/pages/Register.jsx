import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:8080/api/register', formData);
            setMessage('Registracija sėkminga! Nukreipiama...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Registracija nepavyko');
        }
    };

    return (
        <div className="auth-form animate-fade">
            <div className="glass-card">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Registracija</h2>
                {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                {message && <div style={{ color: '#10b981', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}
                <form onSubmit={handleSubmit}>
                    <label>Vartotojo vardas</label>
                    <input
                        type="text"
                        placeholder="Sukurkite vartotojo vardą"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                    />
                    <label>Slaptažodis</label>
                    <input
                        type="password"
                        placeholder="Sukurkite saugų slaptažodį"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
                        <UserPlus size={20} /> Registruotis
                    </button>
                </form>
                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    Jau turite paskyrą? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Prisijungti</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
