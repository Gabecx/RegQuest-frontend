import { useState, useEffect } from 'react';
import { User as UserIcon, FileText, Shield, Award, FileCheck } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Prediction from '../components/Prediction';
import Button from '../components/Button';
import Card from '../components/Card';
import '../styles/HomePage.css';

const HomePage = ({ currentUser }) => {

    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [loadingDocs, setLoadingDocs] = useState(true);
    const [trackingId, setTrackingId] = useState('');

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await api.get('/documents/');
                const data = response.data;
                const formatted = data.map(item => {
                    let icon = <FileText size={40} />;
                    const name = (item.document_name || item.name || '').toLowerCase();
                    if (name.includes('honorable') || name.includes('dismissal')) icon = <Shield size={40} />;
                    else if (name.includes('auth')) icon = <FileCheck size={40} />;
                    else if (name.includes('cert')) icon = <Award size={40} />;
                    
                    return {
                        id: item.id,
                        title: item.document_name || item.name,
                        description: item.description || "Official academic record",
                        price: parseFloat(item.price) || 0,
                        icon: icon
                    };
                });
                setDocuments(formatted.slice(0, 6)); // Display up to 6 on home page
            } catch (err) {
                console.error("Failed to fetch documents:", err);
            } finally {
                setLoadingDocs(false);
            }
        };

        fetchDocuments();
    }, []);

    const handleTrack = () => {
        if (trackingId.trim()) {
            navigate('/track-status', { state: { trackingNumber: trackingId } });
        } else {
            navigate('/track-status');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleTrack();
        }
    };

    const features = [
        {
            id: 1,
            icon: <Shield size={24} />,
            desc: "Your academic records are sensitive. We use enterprise-grade encryption to ensure your data remains private and secure."
        },
        {
            id: 2,
            icon: <FileText size={24} />,
            desc: "By digitizing the application process, we've reduced processing times by up to 50%, getting your documents to you faster."
        },
        {
            id: 3,
            icon: <UserIcon size={24} />,
            desc: "No more standing in long lines. Apply from home, pay online, and track your request status in real-time."
        }
    ];

    return (
        <main className="homepage-container">

            <Navbar currentUser={currentUser} />

            <header className="hero-section">
                <div className="hero-bg"></div>
                <div className="hero-overlay"></div>

                <div className="hero-content">
                    <h1 className="hero-title">
                        Your Credentials,<br />
                        <span className="hero-highlight">Fast & Secure</span>
                    </h1>
                    <p className="hero-subtitle">
                        Request your Transcript of Records, Diploma, and other documents online.
                        Skip the lines and track your request in real-time.
                    </p>

                    <div className="hero-buttons">
                        <Button className="hero-btn-primary" onClick={() => navigate('/request-document')}>Start Request</Button>
                        <Button className="hero-btn-outline" onClick={() => navigate('/track-status')}>Track Status</Button>
                    </div>
                </div>
            </header>

            <section className="credentials-section">
                <h2 className="section-title">Available Credentials</h2>

                <div className="credentials-grid">
                    {loadingDocs ? (
                        <p style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '2rem', color: '#6b7280' }}>Loading available credentials...</p>
                    ) : documents.length === 0 ? (
                        <p style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '2rem', color: '#6b7280' }}>No credentials available at the moment.</p>
                    ) : documents.map((cred) => (
                        <Card key={cred.id} className="credential-card">
                            <div className="card-header-bg">
                                <div className="card-icon">{cred.icon}</div>
                            </div>

                            <div className="card-content">
                                <h3 className="card-title">{cred.title}</h3>
                                <p className="card-desc">{cred.description}</p>
                                
                                <div style={{ 
                                    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
                                    padding: '0.8rem', 
                                    borderRadius: '8px',
                                    marginBottom: '1rem',
                                    marginTop: 'auto'
                                }}>
                                    <Prediction 
                                        label="Estimated Processing Time" 
                                        result="3 to 5 Days" 
                                        confidence={95} 
                                    />
                                </div>

                                <div className="card-footer" style={{ marginTop: '0' }}>
                                    <span className="price-tag">₱ {cred.price}</span>
                                    <Button className="request-btn-small" onClick={() => navigate('/request-document', { state: { selectedDocId: cred.id } })}>Request →</Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="status-section">
                <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>
                    Check Your Request Status
                </h2>
                <p style={{ marginBottom: '2rem', opacity: '0.9' }}>
                    Enter your reference number to see the current stage of your credential request.
                </p>

                <div className="status-check-container">
                    <input
                        type="text"
                        className="status-input"
                        placeholder="Enter Reference ID (e.g., REQ-1234ABCD)"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Button className="status-btn" onClick={handleTrack}>Track Now</Button>
                </div>
            </section>

            <section className="features-section">
                <h2 className="section-title" style={{ textAlign: 'center', color: '#00007F' }}>
                    Streamlining the Credential Process
                </h2>
                <p style={{ maxWidth: '600px', margin: '0 auto', color: '#6b7280' }}>
                    Our mission is to reduce physical queues and improve turnaround time for all registrar services.
                </p>

                <div className="features-grid">
                    {features.map((feature) => (
                        <div key={feature.id} className="feature-item">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">
                                    {feature.icon}
                                </div>
                            </div>
                            <p className="feature-desc">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />

        </main>
    );
};

export default HomePage;