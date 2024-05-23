import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import "./App.css";
import Courses from "./components/Courses";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Check if token is expired
        if (decodedToken.exp > currentTime) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <Courses onLogout={handleLogout} />
      ) : window.location.pathname.includes("signup") ? (
        <SignUp />
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
