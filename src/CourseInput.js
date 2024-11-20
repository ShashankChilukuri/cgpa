import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notificationSound from './mixkit-long-pop-2358.wav';
import './App.css';

const availableCourses = {
  '2ndYear': [],
  '3rdYear': [
    { name: 'SOLUTIONS ARCHITECTING ON CLOUD', credits: 3 },
    { name: 'MACHINE LEARNING (ADVANCED)', credits: 6 },
    { name: 'MACHINE LEARNING (REGULAR)', credits: 4 },
    { name: 'ENTERPRISING PROGRAMING (ADVANCED)', credits: 6 },
    { name: 'ENTERPRISING PROGRAMING (REGULAR)', credits: 4 },
    { name: 'JAVA FULL STACK DEVELOPMENT + MICROSERVICES (ADVANCED)', credits: 4 },
    { name: 'JAVA FULL STACK DEVELOPMENT + MICROSERVICES (REGULAR)', credits: 2 },
    { name: 'COMPILER DESIGN', credits: 3 },
    { name: 'ARTIFICIAL NEURAL NETWORKS', credits: 3 },
    { name: 'SOCIAL IMMERSIVE LERANING', credits: 1 },
    { name: 'PROBLEM SOLVING AND REASONING SKILLS-1', credits: 1 },
  ],
};

const CourseInput = () => {
  const [courses, setCourses] = useState([{ name: '', credits: '', totalMarks: '', internalMarks: '', endSemMarks: '' }]);
  const [cgpa, setCgpa] = useState(0);
  const [error, setError] = useState('');

  const notifySuccess = (message) => {
    const audio = new Audio(notificationSound);
    audio.play();
    toast.success(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const notifyInfo = (message) => {
    const audio = new Audio(notificationSound);
    audio.play();
    toast.info(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const notifyError = (message) => {
    const audio = new Audio(notificationSound);
    audio.play();
    toast.error(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleCourseChange = (index, field, value) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;

    if (field === 'totalMarks' && value !== '') {
      newCourses[index].internalMarks = '';
      newCourses[index].endSemMarks = '';
    } else if ((field === 'internalMarks' || field === 'endSemMarks') && value !== '') {
      newCourses[index].totalMarks = '';
    }

    setCourses(newCourses);
  };

  const addNewCourse = () => {
    if (!courses.some(course => course.name === '')) {
      setCourses([...courses, { name: '', credits: '', totalMarks: '', internalMarks: '', endSemMarks: '' }]);
    }
  };

  const removeCourse = (index) => {
    const newCourses = courses.filter((_, i) => i !== index);
    if (newCourses.length === 0) {
      newCourses.push({ name: '', credits: '', totalMarks: '', internalMarks: '', endSemMarks: '' });
    }
    setCourses(newCourses);
    notifySuccess('Course removed successfully!');
  };

  const grade = (marks) => {
    const total = parseFloat(marks);
    if (90 <= total && total <= 100) return 10;
    if (80 <= total && total < 90) return 9;
    if (65 <= total && total < 80) return 8;
    if (60 <= total && total < 65) return 7;
    if (50 <= total && total < 60) return 6;
    if (45 <= total && total < 50) return 5;
    if (40 <= total && total < 45) return 4;
    return 0;
  };

  const resetCourses = () => {
    setCourses([{ name: '', credits: '', totalMarks: '', internalMarks: '', endSemMarks: '' }]);
    setCgpa(0);
    notifyInfo("All courses have been reset.");
  };

  const calculateCGPA = () => {
    let totalCredits = 0;
    let totalGradePoints = 0;
    let hasError = false;

    courses.forEach((course) => {
      let totalMarks = 0;

      if (course.totalMarks) {
        totalMarks = parseFloat(course.totalMarks);
      } else if (course.internalMarks && course.endSemMarks) {
        totalMarks = parseFloat(course.internalMarks) + parseFloat(course.endSemMarks);
      } else {
        hasError = true;
      }

      if (!hasError) {
        const gradePoints = grade(totalMarks);
        const credits = parseFloat(course.credits);

        totalCredits += credits;
        totalGradePoints += gradePoints * credits;
      }
    });

    if (hasError) {
      setError('Please enter either Total Marks or both Internal and End Sem Marks for each course.');
      notifyError('Error: Missing data for one or more courses.');
      setCgpa(0);
    } else {
      setError('');
      const cgpa = totalCredits !== 0 ? totalGradePoints / totalCredits : 0;
      setCgpa(cgpa);
      notifySuccess(`Your CGPA is ${cgpa.toFixed(2)}`);
    }
  };

  const handleCourseSelect = (index, selectedCourse) => {
    const newCourses = [...courses];
    newCourses[index].name = selectedCourse.name;
    newCourses[index].credits = selectedCourse.credits;
    setCourses(newCourses);
  };

  return (
    <div className="container">
      <div className="course-input-section">
        <h1 className="title">Enter Course Details</h1>

        {courses.map((_, index) => (
          <div key={index} className="course-input-card">
            <h3>Course {index + 1}</h3>

            <div className="form-group">
              <label htmlFor={`name-${index}`}>Course Name:</label>
              <select
                id={`name-${index}`}
                value={courses[index].name}
                onChange={(e) => {
                  const selectedCourse = [
                    ...availableCourses['2ndYear'],
                    ...availableCourses['3rdYear']
                  ].find(course => course.name === e.target.value);
                  handleCourseSelect(index, selectedCourse);
                }}
                className="course-dropdown"
              >
                <option value="">Select a Course</option>
                <optgroup label="2nd Year">
                  {availableCourses['2ndYear'].map((course, i) => (
                    <option key={i} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="3rd Year">
                  {availableCourses['3rdYear'].map((course, i) => (
                    <option key={i} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="form-group">
              <label>Credits: {courses[index].credits}</label>
            </div>

            <div className="form-group">
              <label htmlFor={`totalMarks-${index}`}>Total Marks:</label>
              <input
                type="number"
                placeholder='Out Of 100'
                id={`totalMarks-${index}`}
                value={courses[index].totalMarks}
                onChange={(e) => handleCourseChange(index, 'totalMarks', e.target.value)}
                max="100"
                min="0"
                className="input-field"
              />
            </div>
            <p className="or">OR</p>
            <div className="form-group">
              <label htmlFor={`internalMarks-${index}`}>Internal Marks:</label>
              <input
                type="number"
                placeholder='Out Of 60'
                id={`internalMarks-${index}`}
                value={courses[index].internalMarks}
                onChange={(e) => handleCourseChange(index, 'internalMarks', e.target.value)}
                max="60"
                min="0"
                className="input-field"
              />
              <label htmlFor={`endSemMarks-${index}`}>Expected EndSem Marks (Including Lab Marks):</label>
              <input
                type="number"
                placeholder='Out Of 40'
                id={`endSemMarks-${index}`}
                value={courses[index].endSemMarks}
                onChange={(e) => handleCourseChange(index, 'endSemMarks', e.target.value)}
                max="40"
                min="0"
                className="input-field"
              />
            </div>

            <button className="btn btn-red" onClick={() => removeCourse(index)}>
              Remove Course
            </button>
          </div>
        ))}

        <div className="action-buttons">
          <button onClick={addNewCourse} className="btn btn-success">Add New Course</button>
          <button className="btn btn-success" onClick={resetCourses}>Reset All</button>
          <button onClick={calculateCGPA} className="btn btn-primary">Calculate CGPA</button>
        </div>
      </div>

      <div className="course-display-section">
        <h3>Selected Courses</h3>
        <table className="courses-table">
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Credits</th>
              <th>Total Marks</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index}>
                <td>{course.name}</td>
                <td>{course.credits}</td>
                <td>{course.totalMarks || (parseFloat(course.internalMarks) + parseFloat(course.endSemMarks))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>CGPA: {cgpa.toFixed(2)}</h3>
        {error && <div className="error-message">{error}</div>}
      </div>

      <ToastContainer />
    </div>
  );
};

export default CourseInput;
