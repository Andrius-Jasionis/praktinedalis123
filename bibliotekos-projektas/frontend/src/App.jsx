import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import AddBook from './pages/AddBook';
import MyReservations from './pages/MyReservations';
import './index.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} logout={logout} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/add"
            element={user?.role === 'admin' ? <AddBook /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/edit/:id"
            element={user?.role === 'admin' ? <AddBook /> : <Navigate to="/login" />}
          />
          <Route
            path="/my-reservations"
            element={user ? <MyReservations /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
