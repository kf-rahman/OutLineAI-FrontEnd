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
    };
  }

  // Handles changes in the textarea
  handleTextChange = (e) => {
    this.setState({
      textInput: e.target.value,
    });
  };

  // Handle form submission for processing the text input
  handleSubmit = async () => {
    const { textInput } = this.state;

    if (textInput.trim()) {
      this.setState({ loading: true });

      try {
        const response = await fetch('/extract-and-add-events', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: textInput }),
        });

        console.log(response.headers.get('Content-Type')); // Should be 'application/json'

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
    const { textInput, message, loading } = this.state;

    return (
      <div className="App">
        {/* Header */}
        <Header />

        {/* Main content with text input and submit button */}
        <div className="content">
          <h1>Extract and Add Events</h1>

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
        </div>

        {/* Footer */}
        <Footer />
      </div>
    );
  }
}

export default App;
