import React, { Component } from "react";
import ReactGA from "react-ga";
import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import FileUploadButton from "./Components/DragNDrop";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      textInput: "",
      loading: false,
      message: "",  // Store success/error message
      isAuthenticated: false,  // Track if the user is authenticated
    };

    ReactGA.initialize("UA-110570651-1");
    ReactGA.pageview(window.location.pathname);
  }

  handleFilesSelected = (files) => {
    console.log("Selected files:", files);
  };

  handleTextChange = (event) => {
    this.setState({ textInput: event.target.value });
  };

  // Redirect the user to the backend authentication endpoint
  handleLogin = () => {
    window.location.href = '/api/auth';  // Redirect to the server-side Google OAuth authentication
  };

  // Function to handle the submission of the text to the extract-and-add serverless function
  handleSubmitText = () => {
    this.setState({ loading: true });

    // Call the serverless function to extract dates and add events to Google Calendar
    fetch('/api/extract_add_event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: this.state.textInput })
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("Created Events:", data.createdEvents);
      this.setState({
        message: 'Events added successfully!',
        loading: false,
      });
    })
    .catch((error) => {
      console.error("Error adding events:", error);
      this.setState({
        message: 'Failed to add events.',
        loading: false,
      });
    });
  };

  // Simulate the check for authentication (Replace with real auth token check if available)
  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");  // Assuming token comes from OAuth redirection

    if (token) {
      this.setState({ isAuthenticated: true });
    }
  }

  render() {
    return (
      <div className="App">
        <Header />

        <div className="button-container">
          <FileUploadButton onFilesSelected={this.handleFilesSelected} />
        </div>

        {/* Show login button if the user is not authenticated */}
        {!this.state.isAuthenticated ? (
          <div className="login-container">
            <button onClick={this.handleLogin}>
              Login with Google
            </button>
          </div>
        ) : (
          <>
            {/* Text input and submit button, only accessible if authenticated */}
            <div className="text-input-container">
              <textarea
                value={this.state.textInput}
                onChange={this.handleTextChange}
                placeholder="Paste your text here..."
                rows="5"
                cols="50"
              />
              <button onClick={this.handleSubmitText} disabled={this.state.loading}>
                {this.state.loading ? "Submitting..." : "Submit Text"}
              </button>
            </div>

            {/* Display success/error message */}
            {this.state.message && (
              <div className="message-container">
                <h3>{this.state.message}</h3>
              </div>
            )}
          </>
        )}

        <Footer />
      </div>
    );
  }
}

export default App;
