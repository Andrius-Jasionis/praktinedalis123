import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, User, Shield, LogOut } from 'lucide-react';

const Navbar = ({ user, logout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Book size={28} color="#6366f1" />
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 800, textDecoration: 'none', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Lentyna
                </Link>
            </div>
            <ul className="nav-links">
                <li><Link to="/">Pradžia</Link></li>
                {user?.role === 'admin' && (
                    <li>
                        <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Shield size={18} /> Valdymas
                        </Link>
                    </li>
                )}
                {user && (
                    <li>
                        <Link to="/my-reservations">Mano knygos</Link>
                    </li>
                )}
                {user ? (
                    <>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <User size={18} /> {user.username}
                        </li>
                        <li>
                            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>
                                <LogOut size={16} /> Atsijungti
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login" className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>Prisijungti</Link></li>
                        <li><Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>Registruotis</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
