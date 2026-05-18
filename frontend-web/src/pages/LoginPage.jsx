import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import '../styles/LoginPage.css';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoggingIn) return;
    setError('');
    setIsLoggingIn(true);

    try {
      await login(email, password);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Invalid email or password.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <main className="login-page-container">
      <div className="login-bg-image">
        <div className="login-bg-overlay"></div>
      </div>

      <section className="login-card">

        <section className="left-panel">
          <img 
            src="/regquest-icon.png" 
            alt="RegQuest Icon" 
            style={{ width: '80px', height: 'auto', marginBottom: '2rem', zIndex: 10, position: 'relative', alignSelf: 'center' }} 
          />
          <h2 className="welcome-title">
            Welcome<br />Back!
          </h2>
          <p className="welcome-subtitle">
            Login to access your account
          </p>
        </section>

        <section className="right-panel">
          <header className="form-header">
            <h3 className="form-title">Log In</h3>
            <p className="form-subtitle">Please enter your credentials to continue</p>
          </header>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                Student ID / Email
              </label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Mail className="icon-svg" />
                </div>
                <input
                  type="text"
                  id="email"
                  className="form-input"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Lock className="icon-svg" />
                </div>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <p style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}

            <button type="submit" className="login-button" disabled={isLoggingIn}>
              {isLoggingIn ? 'Logging In...' : 'Log In'}
            </button>

            <footer className="form-footer">
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
              <p className="register-text">
                Don't have an account?{' '}
                <Link to="/register" className="register-link">
                  Register here
                </Link>
              </p>
            </footer>
          </form>
        </section>
      </section>
    </main>
  );
};

export default LoginPage;

