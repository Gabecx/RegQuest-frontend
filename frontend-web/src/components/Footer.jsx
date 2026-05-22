import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-col" style={{ gridColumn: 'span 2' }}>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '300px', color: '#94a3b8' }}>
                        A online portal to streamline the credential request process.
                    </p>
                    <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#64748b' }}>
                        © 2026 RegQuest. All rights reserved.
                    </p>
                </div>

                <div className="footer-col">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/student/home" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link></li>
                        <li><Link to="/student/request-document" style={{ color: 'inherit', textDecoration: 'none' }}>Request Document</Link></li>
                        <li><Link to="/student/track-status" style={{ color: 'inherit', textDecoration: 'none' }}>Track Status</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Support</h4>
                    <ul>
                        <li>How it Works</li>
                        <li>Safety Guidelines</li>
                        <li>FAQ</li>
                        <li>Contact US</li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;