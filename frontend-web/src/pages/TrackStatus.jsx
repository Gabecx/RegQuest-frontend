import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Check, Clock, FileText, Package } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Card from '../components/Card';
import api from '../api/axios';
import '../styles/TrackStatus.css';

const TrackStatus = ({ currentUser }) => {
    const [trackingId, setTrackingId] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [requestData, setRequestData] = useState(null);
    const [error, setError] = useState('');
    const location = useLocation();

    useEffect(() => {
        // If a tracking ID was passed through navigation state, auto-fill and search
        if (location.state?.trackingNumber) {
            setTrackingId(location.state.trackingNumber);
            performSearch(location.state.trackingNumber);
        }
    }, [location.state]);

    const performSearch = async (id) => {
        if (!id.trim()) return;
        
        setIsSearching(true);
        setError('');
        setRequestData(null);
        
        try {
            const response = await api.get(`/requests/track/${id.trim()}/`);
            setRequestData(response.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('Tracking ID not found. Please check and try again.');
            } else {
                setError('An error occurred while tracking. Please try again.');
            }
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearch = async (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            performSearch(trackingId);
        }
    };

    const getStatusState = (stepIndex, currentStatus) => {
        const statuses = ['pending', 'processing', 'ready', 'claimed'];
        const currentIdx = statuses.indexOf(currentStatus);
        
        if (currentIdx > stepIndex) return 'completed';
        if (currentIdx === stepIndex) {
            return currentStatus === 'claimed' ? 'completed' : 'active';
        }
        return 'pending';
    };

    const statusData = requestData ? [
        { id: 1, title: 'Request Received', date: new Date(requestData.created_at).toLocaleDateString(), status: getStatusState(0, requestData.status) },
        { id: 2, title: 'Processing', date: ['processing', 'ready', 'claimed'].includes(requestData.status) ? 'Started' : 'Pending', status: getStatusState(1, requestData.status) },
        { id: 3, title: 'Ready for Pickup', date: ['ready', 'claimed'].includes(requestData.status) ? 'Done' : 'Pending', status: getStatusState(2, requestData.status) },
        { id: 4, title: 'Claimed', date: requestData.status === 'claimed' ? 'Done' : 'Pending', status: getStatusState(3, requestData.status) },
    ] : [];

    return (
        <div className="track-status-page">
            <Navbar currentUser={currentUser} />
            
            <main className="track-main-content">
                <div className="track-header">
                    <h1 className="track-title">Track Your Request</h1>
                    <p className="track-subtitle">Enter your tracking ID to see the current status of your documents.</p>
                </div>

                <div className="track-search-container">
                    <input 
                        type="text" 
                        className="track-input" 
                        placeholder="Enter Reference ID (e.g., REQ-1234ABCD)" 
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    <Button className="track-btn" onClick={handleSearch} disabled={isSearching}>
                        {isSearching ? 'Searching...' : 'Track Now'}
                    </Button>
                </div>

                {error && (
                    <div style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>
                        {error}
                    </div>
                )}

                {requestData && (
                    <Card className="track-result-card" style={{ marginTop: '2rem' }}>
                        <div className="track-result-header">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignSelf: 'center' }}>
                                <span className="track-id-label" style={{ fontWeight: '600' }}>Tracking ID: {requestData.tracking_number}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '1.1rem' }}>{requestData.document_name || 'Document'}</span>
                                    <span style={{ backgroundColor: '#e0e7ff', color: '#4338ca', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                        {requestData.quantity}x
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="track-estimate-label">Estimated Completion</div>
                                <h2 className="track-estimate-date">
                                    {(() => {
                                        if (requestData.created_at && requestData.processing_time_days !== undefined) {
                                            const estDate = new Date(requestData.created_at);
                                            estDate.setDate(estDate.getDate() + requestData.processing_time_days);
                                            return estDate.toLocaleDateString();
                                        }
                                        return new Date(requestData.est_release_date).toLocaleDateString();
                                    })()}
                                </h2>
                            </div>
                        </div>
                        
                        <hr className="track-divider" />

                        <div className="timeline-container">
                            {statusData.map((item) => (
                                <div key={item.id} className={`timeline-step ${item.status}`}>
                                    <div className="timeline-icon-container">
                                        {(item.status === 'completed' || item.status === 'active') ? (
                                            <Check size={item.status === 'completed' ? 18 : 16} strokeWidth={3} />
                                        ) : (
                                            item.id === 2 ? <Clock size={16} strokeWidth={2.5} /> :
                                            item.id === 3 ? <FileText size={16} strokeWidth={2.5} /> :
                                            <Package size={16} strokeWidth={2.5} />
                                        )}
                                    </div>
                                    <div className="timeline-content">
                                        <h3 className="timeline-title">{item.title}</h3>
                                        <p className="timeline-desc">{item.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default TrackStatus;