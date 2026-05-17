import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, CheckCircle, Check, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Card from '../components/Card';
import '../styles/RequestDocument.css';

const API_URL = "http://localhost:8000/api/v1/documents/";

const RequestDocument = ({ currentUser }) => {
    const [documents, setDocuments] = useState([]);
    const [selectedDocs, setSelectedDocs] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [purpose, setPurpose] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState('');

    const navigate = useNavigate();
    const stepperRef = useRef(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch(API_URL, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("jwt_token") || ""}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to load documents");
                }

                const data = await response.json();

                const formatted = data.map(item => ({
                    id: item.id,
                    name: item.document_name || item.name,
                    description: item.description || "Official academic record",
                    price: parseFloat(item.price) || 0,
                    isPerPg: item.is_per_pg || false
                }));

                setDocuments(formatted);
            } catch (err) {
                console.error(err);
                setError("Failed to load documents");

                setDocuments([
                    { id: 1, name: 'Transcript of Records (TOR)', description: 'Official academic record', price: 125, isPerPg: true },
                    { id: 2, name: 'Honorable Dismissal', description: 'Official academic record', price: 100, isPerPg: false },
                    { id: 3, name: 'Evaluation', description: 'Official academic record', price: 50, isPerPg: false },
                    { id: 4, name: 'Authentication', description: 'Official academic record', price: 5, isPerPg: true },
                    { id: 5, name: 'CAR', description: 'Official academic record', price: 80, isPerPg: false },
                    { id: 6, name: 'GPA', description: 'Official academic record', price: 80, isPerPg: false },
                    { id: 7, name: 'Endorsement', description: 'Official academic record', price: 80, isPerPg: false },
                    { id: 8, name: 'Officially Enrolled', description: 'Official academic record', price: 80, isPerPg: false },
                    { id: 9, name: 'Earned Units', description: 'Official academic record', price: 80, isPerPg: false },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    // Auto-scroll stepper on mobile when currentStep changes
    useEffect(() => {
        if (stepperRef.current) {
            const activeStep = stepperRef.current.children[currentStep - 1];
            if (activeStep) {
                activeStep.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [currentStep]);

    const toggleSelection = (id) => {
        setSelectedDocs(prev => 
            prev.includes(id) ? prev.filter(docId => docId !== id) : [...prev, id]
        );
    };

    const calculateTotal = () => {
        return documents
            .filter(doc => selectedDocs.includes(doc.id))
            .reduce((total, doc) => total + (parseFloat(doc.price) || 0), 0);
    };

    const handleNextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const submitRequest = async () => {
        if (selectedDocs.length === 0) {
            alert("Please select at least one document.");
            return;
        }

        try {
            setSubmitting(true);

            // Calculate a release date (e.g., 5 days from now)
            const releaseDate = new Date();
            releaseDate.setDate(releaseDate.getDate() + 5);

            const response = await api.post("/requests/", {
                document_type: selectedDocs[0], // DRF expects the ID for ForeignKey
                quantity: 1,
                total_price: calculateTotal().toFixed(2),
                est_release_date: releaseDate.toISOString()
            });

            console.log("Submission successful:", response.data);

            setTrackingNumber(response.data.tracking_number);
            setCurrentStep(4);

        } catch (error) {
            console.error("Submission error:", error.response?.data || error.message);
            const errorMsg = error.response?.data 
                ? Object.entries(error.response.data).map(([k, v]) => `${k}: ${v}`).join('\n')
                : error.message;
            alert(`Submission failed:\n${errorMsg}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="request-document-page">
            <Navbar currentUser={currentUser} />
            
            <main className="request-main-content">
                <div className="stepper-container" ref={stepperRef}>
                    <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                        <span className="step-label">Select Document</span>
                        <div className="step-line"></div>
                    </div>
                    <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                        <span className="step-label">Review Data</span>
                        <div className="step-line"></div>
                    </div>
                    <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                        <span className="step-label">Payment</span>
                        <div className="step-line"></div>
                    </div>
                    <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
                        <span className="step-label">Complete</span>
                        <div className="step-line"></div>
                    </div>
                </div>

                {currentStep === 1 && (
                    <Card className="request-card">
                        <h2 className="card-title">Select Document</h2>
                        
                        <div className="document-list">
                            {documents.map((doc) => {
                                const isSelected = selectedDocs.includes(doc.id);
                                return (
                                    <div 
                                        key={doc.id} 
                                        className={`document-item ${isSelected ? 'selected' : ''}`}
                                        onClick={() => toggleSelection(doc.id)}
                                    >
                                        <div className="checkbox-container">
                                            <div className={`custom-checkbox ${isSelected ? 'checked' : ''}`}>
                                                {isSelected && (
                                                    <Check size={14} color="white" strokeWidth={3} />
                                                )}
                                            </div>
                                        </div>
                                        <div className="document-info">
                                            <h3 className="document-name">{doc.name}</h3>
                                            <p className="document-desc">{doc.description}</p>
                                        </div>
                                        <div className="document-price">
                                            P{Number(doc.price).toFixed(2)}{doc.isPerPg ? '/pg' : ''}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="total-section">
                            <span className="total-label">Total:</span>
                            <div className="total-amount">P{calculateTotal().toFixed(2)}</div>
                        </div>

                        <div className="action-buttons">
                            <Button className="btn-back" onClick={handleBack} disabled={currentStep === 1} style={{ opacity: currentStep === 1 ? 0 : 1 }}>
                                <ChevronLeft size={16} />
                                Back
                            </Button>
                            <Button className="btn-next" onClick={handleNextStep}>
                                Next Step
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </Card>
                )}

                {currentStep === 2 && (
                    <Card className="request-card">
                        <h2 className="card-title">Review Data</h2>
                        
                        <div className="review-data-container">
                            <div className="review-section">
                                <h3 className="section-subtitle">Document Request:</h3>
                                <hr className="section-divider" />
                                <div className="selected-docs-summary">
                                    {documents.filter(doc => selectedDocs.includes(doc.id)).map(doc => (
                                        <div key={doc.id} className="summary-item">
                                            <div className="summary-doc-info">
                                                <h4 className="summary-doc-name">{doc.name}</h4>
                                                <p className="summary-doc-desc">{doc.description}</p>
                                            </div>
                                            <div className="summary-doc-qty">x1</div>
                                        </div>
                                    ))}
                                    {selectedDocs.length === 0 && (
                                        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>No documents selected.</p>
                                    )}
                                </div>
                            </div>

                            <div className="review-section">
                                <h3 className="section-subtitle">Personal Data:</h3>
                                <hr className="section-divider" />
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input type="text" value={`${currentUser?.first_name || ''} ${currentUser?.last_name || ''}`.trim() || currentUser?.name || 'N/A'} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Year Level</label>
                                        <input type="text" value={
                                            currentUser?.year_level 
                                                ? `${currentUser.year_level}${['st', 'nd', 'rd'][(currentUser.year_level % 10) - 1] || 'th'} Year` 
                                                : 'N/A'
                                        } readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Student ID</label>
                                        <input type="text" value={currentUser?.univ_id || currentUser?.studentId || currentUser?.student_id || 'N/A'} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="email" value={currentUser?.email || 'N/A'} readOnly />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Program / Course</label>
                                        <input type="text" value={currentUser?.program || currentUser?.course || 'N/A'} readOnly />
                                    </div>
                                </div>
                            </div>

                            <div className="review-section">
                                <h3 className="section-subtitle">Purpose of Request:</h3>
                                <hr className="section-divider" />
                                <div className="form-group full-width">
                                    <input 
                                        type="text" 
                                        placeholder="For Personal Files" 
                                        value={purpose} 
                                        onChange={(e) => setPurpose(e.target.value)} 
                                    />
                                </div>
                            </div>
                        </div>

                        <p className="warning-text">Incorrect Information? Contact the admin if you think theres a mistake</p>

                        <div className="action-buttons">
                            <Button className="btn-back" onClick={handleBack} style={{ fontWeight: 800, fontSize: '1.2rem', padding: '0 1rem' }}>
                                Back
                            </Button>
                            <Button className="btn-next" onClick={handleNextStep}>
                                Next Step
                            </Button>
                        </div>
                    </Card>
                )}

                {currentStep === 3 && (
                    <Card className="request-card">
                        <h2 className="card-title">Payment</h2>
                        
                        <div className="payment-summary-box">
                            <h3 className="payment-summary-header">Document Request:</h3>
                            <hr className="section-divider" style={{ borderColor: '#adb5bd' }} />
                            
                            <div className="selected-docs-summary">
                                {documents.filter(doc => selectedDocs.includes(doc.id)).map(doc => (
                                    <div key={doc.id} className="payment-item">
                                        <div className="summary-doc-info">
                                            <h4 className="summary-doc-name">{doc.name}</h4>
                                            <p className="summary-doc-desc">{doc.description}</p>
                                        </div>
                                        <div className="summary-doc-qty">P{Number(doc.price).toFixed(2)}{doc.isPerPg ? '/pg' : ''}</div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="payment-total-row">
                                <span className="payment-total-label">Total Amount</span>
                                <span className="payment-total-amount">P{calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="payment-estimate">
                            <span className="estimate-label">Estimate Completion</span>
                            <span className="estimate-value">3 to 5 Days</span>
                        </div>

                        <h3 className="payment-method-title">Select Payment Method</h3>
                        
                        <div className="payment-methods-grid">
                            <Button 
                                className={`method-btn ${paymentMethod === 'GCash' ? 'selected' : ''}`}
                                onClick={() => setPaymentMethod('GCash')}
                            >
                                GCash
                            </Button>
                            <Button 
                                className={`method-btn ${paymentMethod === 'PayMaya' ? 'selected' : ''}`}
                                onClick={() => setPaymentMethod('PayMaya')}
                            >
                                PayMaya
                            </Button>
                            <Button 
                                className={`method-btn ${paymentMethod === 'Over-the-Counter' ? 'selected' : ''}`}
                                onClick={() => setPaymentMethod('Over-the-Counter')}
                            >
                                Over-the-Counter
                            </Button>
                        </div>

                        <div className="action-buttons">
                            <Button className="btn-back" onClick={handleBack} style={{ fontWeight: 800, fontSize: '1.2rem', padding: '0 1rem' }}>
                                Back
                            </Button>
                            <Button 
                                className="btn-submit" 
                                onClick={submitRequest}
                                disabled={submitting}
                            >
                                {submitting ? "Submitting..." : "Pay & Submit"}
                            </Button>
                        </div>
                    </Card>
                )}

                {currentStep === 4 && (
                    <Card className="request-card">
                        <div className="complete-container">
                            <div className="success-icon-container">
                                <CheckCircle size={80} color="#3CC15E" fill="#3CC15E" stroke="white" strokeWidth={2} />
                            </div>
                            <h2 className="complete-title">Request Submitted!</h2>
                            
                            <p className="complete-message">
                                Your request has been successfully processed. You can track the status of your documents using the ID below.
                            </p>
                            
                            <div className="tracking-box">
                                <p className="tracking-label">Your Tracking ID</p>
                                <h3 className="tracking-id">{trackingNumber || "N/A"}</h3>
                            </div>
                            
                            <div className="complete-actions">
                                <Button className="btn-track" onClick={() => navigate('/track-status', { state: { trackingNumber: trackingNumber } })}>
                                    Track Status
                                </Button>
                                <Link to="/home" className="btn-home">
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </Card>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default RequestDocument;