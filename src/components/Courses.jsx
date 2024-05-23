import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import Navbar from './NavBar';

const Courses = ({ onLogout }) => {
    const [courses, setCourses] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
  
          if (decodedToken.exp > currentTime) {
            fetchCourses(token, decodedToken.userId);
          } else {
            setErrorMessage('Session has expired. Please log in again.');
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Invalid token:', error);
          setErrorMessage('Invalid token. Please log in again.');
          localStorage.removeItem('token');
        }
      } else {
        setErrorMessage('No token found. Please log in.');
      }
    }, []);
  
    const fetchCourses = async (token, userId) => {
      try {
        const response = await axios.get('http://localhost:3000/posts/courses', {
          headers: {
            Authorization: `${token}`,
          },
          params: {
            userId: userId,
          },
        });
  
        if (response.data.message === 'Courses fetched successfully') {
          setCourses(response.data.courses);
        } else {
          console.log(response);
          setErrorMessage('Failed to fetch courses.');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setErrorMessage('Error fetching courses.');
      }
    };
  
    return (
      <div className="courses-container">
        <Navbar onLogout={onLogout} />
        {errorMessage ? (
          <p className="error">{errorMessage}</p>
        ) : (
          <div>
            <h2>Courses</h2>
            <ul className="courses-list">
              {courses.map((course) => (
                <li key={course.course_id} className="course-item">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <p>
                    <strong>Created at:</strong> {new Date(course.created_at).toLocaleString()}
                  </p>
                  <p>
                    <strong>Last updated:</strong> {new Date(course.last_updated).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
        <style jsx>{`
          .courses-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 2rem;
            background-color: #f0f0f0;
          }
          h2 {
            color: #007bff;
          }
          .courses-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            list-style-type: none;
            padding: 0;
            width: 100%;
            max-width: 1200px;
          }
          .course-item {
            background: #fff;
            padding: 1rem;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .course-item h3 {
            margin: 0 0 0.5rem 0;
          }
          .error {
            color: red;
            margin-top: 1rem;
          }
        `}</style>
      </div>
    );
  };
  
  export default Courses;