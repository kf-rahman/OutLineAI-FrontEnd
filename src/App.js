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
      foo: "bar",
      files: [],
      textInput: "",
      loading: false,
      createdEvents: [],
      isAuthenticated: false,  // Track authentication status
      authToken: null  // Store authentication token
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

  // Function to redirect the user to the backend auth endpoint
  handleLogin = () => {
    window.location.href = 'https://your-backend-url/auth';  // Redirect to your backend's /auth route
  };

  // Function to handle submission of the text to the backend
  handleSubmitText = () => {
    if (!this.state.isAuthenticated) {
      alert("Please login before submitting the text.");
      return;
    }

    this.setState({ loading: true });

    // Send the text to the backend with the authentication token
    fetch('https://your-backend-url/extract-and-add-events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.state.authToken}`  // Pass the authentication token
      },
      body: JSON.stringify({ text: this.state.textInput })  // Send the input text to the backend
    })
    .then(response => {
      console.log("Response received: ", response);
      return response.json();
    })
    .then(data => {
      console.log("Created events:", data.createdEvents);
      this.setState({ createdEvents: data.createdEvents, loading: false });
    })
    .catch(error => {
      console.error("Error sending text to backend:", error);
      this.setState({ loading: false });
    });
  };

  // Mock function to check authentication (replace with actual token management)
  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      this.setState({
        isAuthenticated: true,
        authToken: token  // Store the token
      });
    }
  }

  render() {
    return (
      <div className="App">
        <div className="button-container">
          <FileUploadButton onFilesSelected={this.handleFilesSelected} />
        </div>

        {/* Login button, shown if not authenticated */}
        {!this.state.isAuthenticated ? (
          <button onClick={this.handleLogin}>
            Login with Google
          </button>
        ) : (
          <p>Authenticated</p>
        )}

        {/* Text input and submit button, only accessible if authenticated */}
        {this.state.isAuthenticated && (
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
        )}

        <Header />
        <Footer />
      </div>
    );
  }
}

export default App;
