import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css"; // Assuming this has your background and other design elements
import Header from "./Components/Header"; // Header component
import Footer from "./Components/Footer"; // Footer component
import TextSubmitPage from "./Components/TextSubmit"; // New page component

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authToken: null,  // Track authToken here
      isAuthenticated: false // Track login state
    };
  }

  // Fetch the token (from URL or localStorage) once component is mounted
  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const tokenFromURL = params.get("token");
    const tokenFromStorage = localStorage.getItem("authToken");

    if (tokenFromURL) {
      this.setState({ authToken: tokenFromURL, isAuthenticated: true });
      localStorage.setItem("authToken", tokenFromURL);  // Save token for future use

      // Clean the URL after extracting the token
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (tokenFromStorage) {
      this.setState({ authToken: tokenFromStorage, isAuthenticated: true });
    }
  }

  // Login: Redirect to the backend auth route to initiate Google OAuth
  handleLogin = () => {
    window.location.href = 'https://outline-ai-backend-cjk4b70nc-kf-rahmans-projects.vercel.app/auth'; // Replace with actual backend URL
  };

  render() {
    const { authToken, isAuthenticated } = this.state;

    return (
      <Router>
        <div className="App">
          {/* Header */}
          <Header />

          {/* Main content */}
          <div className="content">
            <h1>Welcome to the App</h1>

            {/* Show login button if not authenticated */}
            {!isAuthenticated ? (
              <div className="login-container">
                <button onClick={this.handleLogin}>Login</button>
              </div>
            ) : (
              <Navigate to="/submit-text" state={{ authToken }} /> // Redirect to the text submission page
            )}
          </div>

          {/* Footer */}
          <Footer />
        </div>

        <Routes>
          <Route path="/submit-text" element={<TextSubmitPage />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
