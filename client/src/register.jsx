  import React, { useState } from "react";
  import "./register.css";
  import { useNavigate } from "react-router-dom"; // Import useNavigate

  export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [save, setSave] = useState("");

    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setSave("");
        return;
      }

      try {
          console.log("Inside the try block");
          const response = await fetch("/register", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ username, password, confirmPassword }),
          });
          console.log("This is the response object ", response);
          
          const data = await response.json();
          console.log("Response data:", data);

          if(response.ok) {
              console.log("inside if block");
              setSave(data.message || "Registration successful!");
              setError("");
              navigate("/home", {state: username});     
          } else {
              console.log("inside else block");
              setSave("");
              setError(data.message || "Registration failed.");
          }
      } catch (err) {
          console.error("Error during registration:", err);
          setError("An error occurred. Please try again.");
      }
    };

    return (
      <div className="register-container">
        <div className="register-card">
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Join us and start exploring today.</p>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {save && <p className="success-message">{save}</p>}
            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="register-btn">
              Register
            </button>
          </form>
        </div>
      </div>
    );
  }
