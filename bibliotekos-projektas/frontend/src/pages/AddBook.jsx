import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';

const AddBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category_id: '',
        description: '',
        image_url: '',
        isbn: '',
        pages: ''
    });
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        fetchCategories();
        if (id) {
            fetchBook();
        }
    }, [id]);

    const fetchCategories = async () => {
        const res = await axios.get('http://localhost:8080/api/categories');
        setCategories(res.data);
    };

    const fetchBook = async () => {
        const res = await axios.get('http://localhost:8080/api/books');
        const book = res.data.find(b => b.id === parseInt(id));
        if (book) {
            setFormData(book);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        try {
            if (id) {
                await axios.put(`http://localhost:8080/api/books/${id}`, formData);
            } else {
                await axios.post('http://localhost:8080/api/books', formData);
            }
            navigate('/admin');
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors(['Įvyko klaida išsaugant duomenis.']);
            }
        }
    };

    return (
        <div className="animate-fade">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/admin')} className="btn btn-outline" style={{ padding: '0.5rem' }}>
                    <ArrowLeft size={20} />
                </button>
                <h1>{id ? 'Redaguoti knygą' : 'Pridėti naują knygą'}</h1>
            </div>

            <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                {errors.length > 0 && (
                    <div style={{ background: '#fef2f2', borderLeft: '4px solid #ef4444', padding: '1rem', marginBottom: '1.5rem', borderRadius: '4px' }}>
                        <ul style={{ listStyle: 'none', color: '#b91c1c' }}>
                            {errors.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label>Knygos pavadinimas *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Pvz. Mažasis princas"
                            />
                        </div>
                        <div>
                            <label>Autorius *</label>
                            <input
                                type="text"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                placeholder="Pvz. Antoine de Saint-Exupéry"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label>Kategorija *</label>
                            <select
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                            >
                                <option value="">Pasirinkite kategoriją</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Nuotraukos URL</label>
                            <input
                                type="text"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                placeholder="https://nuoroda.lt/foto.jpg"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label>ISBN</label>
                            <input
                                type="text"
                                value={formData.isbn}
                                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                                placeholder="Pvz. 978-3-16-148410-0"
                            />
                        </div>
                        <div>
                            <label>Puslapių skaičius</label>
                            <input
                                type="number"
                                value={formData.pages}
                                onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                                placeholder="Pvz. 120"
                            />
                        </div>
                    </div>

                    <div>
                        <label>Aprašymas</label>
                        <textarea
                            rows="5"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Trumpas knygos aprašymas..."
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
                        <Save size={20} /> Išsaugoti knygą
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddBook;
