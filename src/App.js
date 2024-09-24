import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      authToken: null,
      textInput: '',
    };
  }

  // When the component mounts, check if a token is in the URL or in localStorage
  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    let token = params.get('token');

    console.log('Token from URL:', token); // Debugging token

    // Check if token exists in localStorage if not in URL
    if (!token) {
      token = localStorage.getItem('authToken');
    }

    if (token) {
      this.setState({
        isAuthenticated: true,
        authToken: token,
      });

      // Save token to localStorage if not already stored
      localStorage.setItem('authToken', token);
    }
  }

  // Handles login by redirecting to the backend OAuth endpoint
  handleLogin = () => {
    window.location.href = 'https://outline-ai-backend-lwf7g03uw-kf-rahmans-projects.vercel.app//auth';
  };

  // Handles changes in the textarea
  handleTextChange = (e) => {
    this.setState({
      textInput: e.target.value,
    });
  };

  // Handle form submission for processing the text input (adjust as per your API)
  handleSubmit = async () => {
    const { textInput, authToken } = this.state;

    try {
      const response = await fetch('https://outline-ai-backend-lwf7g03uw-kf-rahmans-projects.vercel.app//extract-and-add-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ text: textInput }),
      });

      const data = await response.json();
      console.log('Response:', data);
      alert('Events added successfully!');
    } catch (error) {
      console.error('Error submitting text:', error);
      alert('Failed to add events');
    }
  };

  render() {
    const { isAuthenticated, textInput } = this.state;

    return (
      <div className="App">
        <div className="button-container">
          {/* File upload component if you have it */}
          {/* <FileUploadButton onFilesSelected={this.handleFilesSelected} /> */}
        </div>

        {/* Show login button if not authenticated */}
        {!isAuthenticated ? (
          <button onClick={this.handleLogin}>
            Login with Google
          </button>
        ) : (
          <p>Authenticated</p>
        )}

        {/* Show text input and submit button only if authenticated */}
        {isAuthenticated && (
          <div className="text-input-container">
            <textarea
              value={textInput}
              onChange={this.handleTextChange}
              placeholder="Paste your text here..."
              rows="5"
              cols="50"
            />
            <br />
            <button onClick={this.handleSubmit}>Submit</button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
