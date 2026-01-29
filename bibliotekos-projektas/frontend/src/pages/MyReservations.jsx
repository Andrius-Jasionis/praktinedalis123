import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Clock } from 'lucide-react';

const MyReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchMyReservations();
    }, []);

    const fetchMyReservations = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/my-reservations', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReservations(res.data);
        } catch (err) {
            console.error('Klaida kraunant rezervacijas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade">
            <h1>Mano rezervuotos knygos</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Čia matote visas knygas, kurias pasirinkote atsiimti bibliotekoje.</p>

            {loading ? (
                <div>Kraunama...</div>
            ) : reservations.length > 0 ? (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {reservations.map(res => (
                        <div key={res.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ background: 'var(--primary)', padding: '1rem', borderRadius: '12px' }}>
                                    <BookOpen color="white" size={32} />
                                </div>
                                <div>
                                    <h3 style={{ marginBottom: '0.2rem' }}>{res.title}</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>{res.author}</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <Clock size={16} />
                                Rezervuota: {new Date(res.reservation_date).toLocaleDateString('lt-LT')}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Jūs dar neturite rezervuotų knygų.</p>
                </div>
            )}
        </div>
    );
};

export default MyReservations;
