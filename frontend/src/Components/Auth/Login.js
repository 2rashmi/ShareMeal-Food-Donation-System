import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Login() {
    const [inputs, setInputs] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Sending login data:", inputs);
            
            // Configure axios request
            const config = {
                method: 'post',
                url: 'http://localhost:5001/users/login',
                data: inputs,
                headers: {
                    'Content-Type': 'application/json',
                },
                validateStatus: function (status) {
                    return status >= 200 && status < 500; // Accept all status codes less than 500
                }
            };

            const response = await axios(config);
            console.log("Login response:", response);
            
            if (response.status === 200 && response.data && response.data.user) {
                localStorage.setItem("user", JSON.stringify(response.data.user));
                const role = response.data.user.role;
                if (role === "Admin") navigate("/admin");
                else if (role === "Donor") navigate("/donor");
                else if (role === "NGO") navigate("/ngo");
                else navigate("/delivery");
            } else {
                throw new Error(response.data?.message || "Login failed");
            }
        } catch (err) {
            console.error("Login error details:", {
                message: err.message,
                response: err.response,
                request: err.request,
                config: err.config
            });
            
            let errorMessage = "Login failed: ";
            if (err.response) {
                // Server responded with error
                errorMessage += err.response.data?.message || err.response.statusText || "Server error";
            } else if (err.request) {
                // Request made but no response
                errorMessage += "No response from server. Please check if the server is running.";
            } else {
                // Request setup error
                errorMessage += err.message || "Unknown error occurred";
            }
            
            alert(errorMessage);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-container">
                <h1 className="auth-title">Login</h1>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Username" 
                        onChange={handleChange} 
                        required 
                        className="auth-input"
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        onChange={handleChange} 
                        required 
                        className="auth-input"
                    />
                    <button type="submit" className="auth-button">Login</button>
                </form>
                <p className="auth-link">Don't have an account? <a href="/register">Register here</a></p>
            </div>
        </div>
    );
}

export default Login;