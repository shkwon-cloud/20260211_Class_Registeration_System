import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Student from './pages/Student';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '2rem' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🏠 Home</Link>
        <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>🔑 Admin</Link>
        <Link to="/student" style={{ color: 'white', textDecoration: 'none' }}>🎓 Student</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/student" element={<Student />} />
      </Routes>
    </Router>
  );
}

export default App;
