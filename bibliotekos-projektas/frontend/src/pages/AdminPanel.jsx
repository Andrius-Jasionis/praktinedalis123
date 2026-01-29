import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';

const AdminPanel = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/books');
            setBooks(res.data);
        } catch (err) {
            console.error('Klaida kraunant knygas');
        }
    };

    const deleteBook = async (id) => {
        if (window.confirm('Ar tikrai norite ištrinti šią knygą?')) {
            try {
                await axios.delete(`http://localhost:8080/api/books/${id}`);
                setBooks(books.filter(b => b.id !== id));
            } catch (err) {
                alert('Ištrinti nepavyko');
            }
        }
    };

    return (
        <div className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Knygų valdymas</h1>
                <Link to="/admin/add" className="btn btn-primary">
                    <Plus size={20} /> Pridėti knygą
                </Link>
            </div>

            <div className="glass-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Pavadinimas</th>
                            <th>Autorius</th>
                            <th>Kategorija</th>
                            <th>Veiksmai</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => (
                            <tr key={book.id}>
                                <td style={{ fontWeight: 600 }}>{book.title}</td>
                                <td>{book.author}</td>
                                <td><span className="category-tag">{book.category_name}</span></td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Link to={`/admin/edit/${book.id}`} className="btn btn-outline" style={{ padding: '0.5rem' }}>
                                            <Edit size={16} />
                                        </Link>
                                        <button onClick={() => deleteBook(book.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;
