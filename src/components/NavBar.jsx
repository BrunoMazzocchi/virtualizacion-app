import axios from 'axios';
import React from 'react';

const Navbar = ({ onLogout }) => {
  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.post('http://localhost:3000/users/auth/logout', {}, {
          headers: {
            'Authorization': `token ${token}`
          }
        });
        localStorage.removeItem('token');
        onLogout();
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>Courses App</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <style jsx>{`
        .navbar {
          width: 100%;
          background-color: #007bff;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
        }
        .navbar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .logout-button {
          background-color: #fff;
          color: #007bff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
        }
        .logout-button:hover {
          background-color: #f0f0f0;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
