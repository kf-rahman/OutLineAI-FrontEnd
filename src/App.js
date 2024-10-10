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
      authToken: null,
      isAuthenticated: false
    };
  }

 componentDidMount() {
  const params = new URLSearchParams(window.location.search);
  const tokenFromURL = params.get("token");
  if (tokenFromURL) {
    localStorage.setItem("authToken", tokenFromURL);
    this.setState({ authToken: tokenFromURL, isAuthenticated: true });
    window.history.replaceState({}, document.title, window.location.pathname);
    setTimeout(() => this.forceUpdate(), 100); // This will force a re-render after updating state
  }
}


  handleLogin = () => {
    window.location.href = 'https://outline-ai-backend.vercel.app/auth';
  };

  handleTextChange = (e) => {
    this.setState({ textInput: e.target.value });
  };

  handleSubmit = async () => {
    const { textInput, authToken } = this.state;
    if (!authToken) {
      alert('You are not authenticated. Please login.');
      return;
    }
    if (textInput.trim()) {
      this.setState({ loading: true });
      try {
        const response = await fetch('https://outline-ai-backend.vercel.app/extract-and-add-events', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}` // This line ensures the token is sent
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
    const { isAuthenticated } = this.state;
    return (
      <div className="App">
        <Header />
        <div className="content">
          {!isAuthenticated ? (
            <div className="login-container">
              <button onClick={this.handleLogin}>Login</button>
            </div>
          ) : (
            <div>
              <h2>Welcome back! You are logged in.</h2>
              <textarea onChange={this.handleTextChange} placeholder="Enter text to extract events" />
              <button onClick={this.handleSubmit}>
                test
              </button>
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;