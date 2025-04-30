import React from "react";
import { Link } from "react-router-dom";
import "../../App.css";

function Home() {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content"
                    <h1>Food Donation Management System</h1>
                    <p>Connecting donors with NGOs to reduce food waste and help those in need</p>

                    <h1>ShareMeal</h1>
                 
                    <h2>Connecting donors with NGOs to reduce food waste and help those in need</h2>
                   

                    <div className="hero-buttons">
                        <Link to="/register" className="btn btn-primary">Get Started</Link>
                        <Link to="/login" className="btn btn-secondary">Login</Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2>How It Works</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🍽️</div>
                        <h3>Donate Food</h3>
                        <p>Donors can easily post their surplus food donations with details about quantity and expiry date.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🤝</div>
                        <h3>NGO Claims</h3>
                        <p>NGOs can browse and claim available donations to distribute to those in need.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🚚</div>
                        <h3>Delivery Management</h3>
                        <p>Efficient delivery system to ensure food reaches its destination safely and on time.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Track Progress</h3>
                        <p>Real-time tracking of donations, claims, and deliveries through our dashboard.</p>
                    </div>
                </div>
            </section>

            {/* Impact Section */}
            <section className="impact-section">
                <div className="impact-content">
                    <h2>Our Impact</h2>
                    <div className="impact-stats">
                        <div className="stat-item">
                            <span className="stat-number">1000+</span>
                            <span className="stat-label">Donations Made</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">50+</span>
                            <span className="stat-label">NGOs Connected</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">5000+</span>
                            <span className="stat-label">Lives Impacted</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Make a Difference?</h2>
                    <p>Join our community of donors and NGOs to help reduce food waste and feed those in need.</p>
                    <Link to="/register" className="btn btn-primary">Sign Up Now</Link>
                </div>
            </section>
        </div>
    );
}

export default Home; 