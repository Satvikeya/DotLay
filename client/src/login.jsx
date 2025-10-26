import "./register.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

export default function Login() {
    // Get the navigate function
    const navigate = useNavigate(); 
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const[msg, setMsg] = useState("");
    const[error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        //send the username and password to the server
        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            console.log(response, "This is the response object via fetch");
            console.log("Response status:", response.status);
            
            const data = await response.json();
            if (response.ok) {
                // Login successful
                console.log("Login successful:", data);
                setMsg(data.message || "Login successful!");
                setError("");
                navigate("/home", {state: username}); 
                console.log("Navigating to /home");
                
            } else {
                // Login failed
                console.log("Login failed:", data);
                setError(data.message || "Login failed.");
                setMsg("");
                // Show error message to the user
            }
        } catch (err) {
            console.error("Error during login:", err);
            setError("An unexpected error occurred. Please try again."); // Add a generic error message
            setMsg("");
        }
    };

    return (
        <div className = "register-container">
            <div className = "register-card">
                <h2 className="register-title">Sign In</h2>
                <br/>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                        type="text"
                        value ={username} 
                        onChange = {(e) => setUsername(e.target.value)}
                        required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                        type = "password"
                        value={password}
                        onChange = {(e) => setPassword(e.target.value)}
                        required
                        />
                    </div>
                    
                    {msg && <p className="success-message">{msg}</p>}
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="register-btn">
                        Sign In
                    </button>
                    
                    <br/>
                    <br/>
                    
                    <p> New User? <Link className = "register-link" to="/register">Register</Link> here.</p>

                </form>
            </div>
        </div>
    );
}