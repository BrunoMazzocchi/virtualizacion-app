import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import Navbar from './NavBar';

const Courses = ({ onLogout }) => {
    const [courses, setCourses] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
  
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
          setErrorMessage('Failed to fetch courses.');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setErrorMessage('Error fetching courses.');
      }
    };
  
    const handleDeleteClick = (courseId) => {
      setSelectedCourseId(courseId);
      setShowConfirm(true);
    };
  
    const handleConfirmDelete = async () => {
      const token = localStorage.getItem('token');
      try {
        await axios.post(
          `http://localhost:3000/posts/courses/${selectedCourseId}/remove`,
          {},
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setShowConfirm(false);
        fetchCourses(token, jwtDecode(token).userId);
      } catch (error) {
        console.error('Error removing course:', error);
        setErrorMessage('Error removing course.');
      }
    };
  
    const handleCancelDelete = () => {
      setShowConfirm(false);
      setSelectedCourseId(null);
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
                  <button className="delete-button" onClick={() => handleDeleteClick(course.course_id)}>X</button>
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
        {showConfirm && (
          <div className="confirm-dialog">
            <p>Si remueve el curso, no podrá agregarlo hasta dentro de 1 año.</p>
            <button onClick={handleConfirmDelete}>Confirmar</button>
            <button onClick={handleCancelDelete}>Cancelar</button>
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
            position: relative;
            background: #fff;
            padding: 1rem;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .delete-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: red;
            color: white;
            border: none;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            cursor: pointer;
          }
          .course-item h3 {
            margin: 0 0 0.5rem 0;
          }
          .error {
            color: red;
            margin-top: 1rem;
          }
          .confirm-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            z-index: 1000;
          }
          .confirm-dialog p {
            margin-bottom: 1rem;
          }
          .confirm-dialog button {
            margin-right: 1rem;
          }
        `}</style>
      </div>
    );
  };
  
  export default Courses;