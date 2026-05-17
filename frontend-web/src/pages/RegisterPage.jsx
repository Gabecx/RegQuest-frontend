import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, IdCard, GraduationCap, Calendar, Mail, Upload, Lock } from 'lucide-react';
import '../styles/RegisterPage.css';
import api from '../api/axios';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [program, setProgram] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const nextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const prevStep = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await api.post('/accounts/register/', {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        role: "student",
        univ_id: studentId,
        course: program,
        year_level: yearLevel ? parseInt(yearLevel) : 1
      });

      console.log('Registration successful', response.data);
      navigate('/success', { state: { firstName, lastName } });
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred during registration.');
      }
    }
  };

  return (
    <main className="register-page-container">
      <div className="register-bg-image">
        <div className="register-bg-overlay"></div>
      </div>

      <section className="register-card">
        <section className="register-left-panel">

          <img 
            src="/regquest-icon.png" 
            alt="RegQuest Icon" 
            style={{ width: '80px', height: 'auto', marginBottom: '2rem', zIndex: 10, position: 'relative', alignSelf: 'center' }} 
          />

          <h2 className="register-welcome-title">
            WELCOME to<br />RegQuest
          </h2>
          <p className="register-welcome-subtitle">
            Fill up the information
          </p>
        </section>

        <section className="register-right-panel">
          <header className="register-form-header">
            <h3 className="register-form-title">Create Account</h3>
            <p className="register-step-indicator">
              Step {step} of 2 &nbsp; {step === 1 ? 'Personal Details' : 'Account Details'}
            </p>
          </header>

          <form className="register-form" onSubmit={handleRegister}>

            {step === 1 && (
              <>
                <div className="input-group">
                  <label className="input-label">First Name</label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <User className="icon-svg" />
                    </div>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Provide your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Last Name</label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <User className="icon-svg" />
                    </div>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Provide your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Student ID</label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <IdCard className="icon-svg" />
                    </div>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Provide your student ID" 
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Program / Course</label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <GraduationCap className="icon-svg" />
                    </div>
                    <select 
                      className="form-input" 
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      style={{ appearance: 'none', backgroundColor: 'transparent' }}
                    >
                      <option value="" disabled>Select your program/course</option>
                      <option value="BS in Information Technology">BS in Information Technology</option>
                      <option value="BS in Computer Science">BS in Computer Science</option>
                      <option value="BS in Information Systems">BS in Information Systems</option>
                      <option value="BS in Engineering">BS in Engineering</option>
                      <option value="BS in Business Administration">BS in Business Administration</option>
                      <option value="BA in Communication">BA in Communication</option>
                      <option value="BS in Psychology">BS in Psychology</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Year Level</label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <Calendar className="icon-svg" />
                    </div>
                    <select 
                      className="form-input" 
                      value={yearLevel}
                      onChange={(e) => setYearLevel(e.target.value)}
                      style={{ appearance: 'none', backgroundColor: 'transparent' }}
                    >
                      <option value="" disabled>Select your year level</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="5">5th Year</option>
                    </select>
                  </div>
                </div>

                <div className="register-buttons">
                  <button onClick={nextStep} className="register-btn-next">Next Step</button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <Mail className="icon-svg" />
                    </div>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="Enter your email address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Upload School ID</label>
                  <label className="file-upload-label">
                    <Upload className="h-8 w-5" />
                    Upload File (.png, .jpg, .jpeg)
                    <input type="file" className="hidden" style={{ display: 'none' }} />
                  </label>
                </div>

                <div className="input-group">
                  <label className="input-label">Password</label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <Lock className="icon-svg" />
                    </div>
                    <input 
                      type="password" 
                      className="form-input" 
                      placeholder="Enter your password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Confirm Password</label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <Lock className="icon-svg" />
                    </div>
                    <input 
                      type="password" 
                      className="form-input" 
                      placeholder="Re-enter your password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                {error && <p style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}

                <div className="register-buttons">
                  <button onClick={prevStep} className="register-btn-back">Back</button>
                  <button onClick={handleRegister} className="btn-register">Register</button>
                </div>
              </>
            )}

            <footer className="form-footer">
              <p className="register-text">
                Already have an account?{' '}
                <Link to="/" className="register-link">
                  Login here
                </Link>
              </p>
            </footer>

          </form>
        </section>
      </section>
    </main>
  );
};
export default RegisterPage;