import React, { Component } from "react";
import "./App.css"; // Assuming this has your background and other design elements
import Header from "./Components/Header"; // Header component
import Footer from "./Components/Footer"; // Footer component

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textInput: '',
      message: '',
      loading: false,
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

  // Handles changes in the textarea
  handleTextChange = (e) => {
    this.setState({
      textInput: e.target.value,
    });
  };

  // Handle form submission for processing the text input
  handleSubmit = async () => {
    const { textInput, authToken } = this.state;

    if (!authToken) {
      alert('You are not authenticated. Please login.');
      return;
    }

    if (textInput.trim()) {
      this.setState({ loading: true });

      try {
        const response = await fetch('https://outline-ai-backend-cjk4b70nc-kf-rahmans-projects.vercel.app/extract-and-add-events', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`  // Pass the token in the request headers
          },
          body: JSON.stringify({ text: textInput })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Response:', data);
          this.setState({ message: 'Events added successfully!', loading: false });
        } else {
          this.setState({ message: 'Failed to add events.', loading: false });
        }
      } catch (error) {
        console.error('Error submitting text:', error);
        this.setState({ message: 'Failed to add events.', loading: false });
      }
    } else {
      alert('Please enter some text.');
    }
  };

  render() {
    const { textInput, message, loading, isAuthenticated } = this.state;

    return (
      <div className="App">
        {/* Header */}
        <Header />

        {/* Main content */}
        <div className="content">
          <h1>Extract and Add Events</h1>

          {/* Show login button if not authenticated */}
          {!isAuthenticated ? (
            <div className="login-container">
              <button onClick={this.handleLogin}>Login</button>
            </div>
          ) : (
            <>
              {/* Text input and submit button, only accessible if authenticated */}
              <div className="text-input-container">
                <textarea
                  value={textInput}
                  onChange={this.handleTextChange}
                  placeholder="Paste your text here..."
                  rows="5"
                  cols="50"
                />
                <br />
                <button onClick={this.handleSubmit} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Text'}
                </button>
              </div>

              {/* Display success/error message */}
              {message && (
                <div className="message-container">
                  <h3>{message}</h3>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    );
  }
}

export default App;
