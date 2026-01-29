import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Calendar } from 'lucide-react';

const Home = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchCategories();
        fetchBooks();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/categories');
            setCategories(res.data);
        } catch (err) {
            console.error('Klaida kraunant kategorijas');
        }
    };

    const fetchBooks = async (catId = '') => {
        setLoading(true);
        try {
            const url = catId
                ? `http://localhost:8080/api/books/search?categoryId=${catId}`
                : 'http://localhost:8080/api/books';
            const res = await axios.get(url);
            setBooks(res.data);
        } catch (err) {
            console.error('Klaida kraunant knygas');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (e) => {
        const id = e.target.value;
        setSelectedCategory(id);
        fetchBooks(id);
    };

    const handleReserve = async (bookId) => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const currentToken = localStorage.getItem('token');

        if (!currentUser || !currentToken) {
            setMessage({ type: 'error', text: 'Norėdami rezervuoti, turite prisijungti.' });
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/reservations', { bookId }, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });
            setMessage({ type: 'success', text: 'Knyga sėkmingai rezervuota!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Rezervacija nepavyko. Bandykite dar kartą.';
            setMessage({ type: 'error', text: errorMsg });
        }
    };

    return (
        <div className="animate-fade">
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1>Atraskite kitą savo istoriją</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Rezervuokite knygas vos keliais spustelėjimais</p>
            </header>

            {message && (
                <div className={`glass-card animate-fade`} style={{
                    marginBottom: '2rem',
                    textAlign: 'center',
                    background: message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    borderColor: message.type === 'success' ? '#10b981' : '#ef4444',
                    color: message.type === 'success' ? '#065f46' : '#991b1b'
                }}>
                    {message.text}
                </div>
            )}

            <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Search size={24} color="var(--text-muted)" />
                <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    style={{ marginBottom: 0, background: 'transparent', border: 'none', fontSize: '1.1rem' }}
                >
                    <option value="">Visos kategorijos</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Kraunama...</div>
            ) : (
                <div className="books-grid">
                    {books.map(book => (
                        <div key={book.id} className="glass-card book-card">
                            <img
                                src={book.image_url || 'https://images.unsplash.com/photo-1543005157-865a50d4598f?q=80&w=1000&auto=format&fit=crop'}
                                alt={book.title}
                                className="book-img"
                            />
                            <div className="book-info">
                                <span className="category-tag">{book.category_name}</span>
                                <h3>{book.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{book.author}</p>
                                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {book.description || 'Nėra aprašymo.'}
                                </p>
                                <button
                                    onClick={() => handleReserve(book.id)}
                                    className="btn btn-primary"
                                    style={{ width: '100%', justifyContent: 'center' }}
                                >
                                    <Calendar size={18} /> Rezervuoti
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && books.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Šioje kategorijoje knygų nerasta.
                </div>
            )}
        </div>
    );
};

export default Home;
