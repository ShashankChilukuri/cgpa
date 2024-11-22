import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notificationSound from './mixkit-long-pop-2358.wav';
import './App.css';
import cgpaLogo from './cgpa.png';
const availableCourses = {
  '1stYear': [
    { name: 'DISCRETE MATHEMATICS', credits: 4 },
    { name: 'FUNDAMENTALS OF IOT AND SENSORS', credits: 4 },
    { name: 'COMPUTATIONAL THINKING FOR STRUCTURED DESIGN', credits: 5 },
    { name: 'HUMAN VALUES GENDER EQUITY AND PROFESSIONAL ETHICS', credits: 2 },
    { name: 'DESIGN THINKING AND INNOVATION', credits: 3 },
    { name: 'LANGUAGE SKILLS FOR ENGINEERS', credits: 2 }
  ],
  '2ndYear': [  
    { name: 'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING (ADVANCED)', credits: 4 },
    { name: 'PROCESSORS AND CONTROLLERS', credits: 4 },
    { name: 'LINUX ADMINISTRATION & AUTOMATION', credits: 4 },
    { name: 'DESIGN AND ANALYSIS OF ALGORITHMS (ADVANCED)', credits: 7 },
    { name: 'DATABASE MANAGEMENT SYSTEMS (ADVANCED)', credits: 6 },
    { name: 'JAPANESE LANGUAGE', credits: 3 },
    { name: 'SOCIAL IMMERSIVE LEARNING', credits: 1 },
    { name: 'PROBABILITY, STATISTICS & QUEUEING THEORY', credits: 4 }
  ],
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
    { name: 'DATA WAREHOUSING & MINING', credits: 3 },
    { name: 'DATA ANALYTICS AND VISUALIZATION (ADVANCED)', credits: 6 },
    { name: 'DATA ANALYTICS AND VISUALIZATION (REGULAR)', credits: 4 },
    { name: 'INTRODUCTION TO BLOCKCHAIN & CRYPTO CURRENCIES ', credits: 3 },
    { name: 'CRYPT ANALYSIS & CYBER DEFENSE (REGULAR)', credits: 4 },
    { name: 'CRYPT ANALYSIS & CYBER DEFENSE (ADVANCED)', credits: 6 },
  ],
};

const CourseInput = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [courses, setCourses] = useState([{ name: '', credits: '', totalMarks: '', internalMarks: '', endSemMarks: '' }]);
  const [cgpa, setCgpa] = useState(0);
  const [error, setError] = useState('');
  const [tcredits,setCredits]=useState(0);
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
        if (isNaN(totalMarks) || totalMarks > 100 || totalMarks < 0) {
          notifyError("Please enter valid marks between 0 and 100.");
          hasError = true;
          return;
        }
      } else if (course.internalMarks && course.endSemMarks) {
        const internalMarks = parseFloat(course.internalMarks);
        const endSemMarks = parseFloat(course.endSemMarks);
      
        if (
          isNaN(internalMarks) || isNaN(endSemMarks) ||
          internalMarks < 0 || internalMarks > 100 ||
          endSemMarks < 0 || endSemMarks > 100
        ) {
          notifyError("Internal and End-Sem marks must be between 0 and 100.");
          hasError = true;
          return;
        }
      
        totalMarks = internalMarks + endSemMarks;
      
        if (totalMarks > 100) {
          notifyError("The combined marks should not exceed 100.");
          hasError = true;
          return;
        }
      } else {
        hasError = true;
        notifyError("Please provide the necessary marks.");
        return;
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
      setCredits(totalCredits);
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
  const handleYearChange = (e) => {
    const selectedYear = e.target.value;
    setSelectedYear(selectedYear);
    
    setCourses([{ name: '', credits: '', totalMarks: '', internalMarks: '', endSemMarks: '' }]);
  };
  return (

    <div>
      <header className="header">
        <img src={cgpaLogo} alt="CGPA Logo" className="logo" />
        <h1 className="title">CGPA Calculator</h1>
      </header>
    <div className="container">
      <div className="course-input-section">
        <h2>Enter Course Details</h2>
        <select
              value={selectedYear}
              onChange={handleYearChange}
              className="input-field"
            >
              <option value="">Select Year</option>
              <option value="1stYear">1st Year</option>
              <option value="2ndYear">2nd Year</option>
              <option value="3rdYear">3rd Year</option>
            </select>
        {courses.map((_, index) => (
          <div key={index} className="course-input-card">
            <h3>Course {index + 1}</h3>
            
            <div className="form-group">
              <label htmlFor={`name-${index}`}>Course Name:</label>
              <select
                id={`name-${index}`}
                value={courses[index].name}
                onChange={(e) => {
                  const selectedCourse = availableCourses[selectedYear]?.find(course => course.name === e.target.value);
                  if (selectedCourse) {
                    handleCourseSelect(index, selectedCourse);
                  }
                }}
                className="course-dropdown"
              >
                <option value="">Select a Course</option>
                {selectedYear && (
                  <>
                    <optgroup label={`${selectedYear.charAt(0).toUpperCase() + selectedYear.slice(1)} Courses`}>
                      {availableCourses[selectedYear].map((course, i) => (
                        <option key={i} value={course.name}>
                          {course.name}
                        </option>
                      ))}
                    </optgroup>
                  </>
                )}
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
        <h3>TOTAL CREDITS: {tcredits}</h3>
        {error && <div className="error-message">{error}</div>}

        {/* AdSense Ad */}
        <div className="ads-container">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1602297763656058"
            crossorigin="anonymous"></script>
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-1602297763656058"
            data-ad-slot="XXXXXX" // Replace with your Ad Unit ID
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
          <script>{`(adsbygoogle = window.adsbygoogle || []).push({});`}</script>
        </div>
      </div>


      <ToastContainer />
    </div>
    </div>
  );
};

export default CourseInput;
