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
      resumeData: {},
      files: [],
      textInput: "",  // New state to store the pasted text
      loading: false,
      createdEvents: []
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

  // Function to handle submission of the text to the backend
  handleSubmitText = () => {
    this.setState({ loading: true });

    // Send the text to the backend
    fetch('https://outline-ai-backend.vercel.app//extract-and-add-events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: this.state.textInput })  // Send the input text to the backend
    })
    .then(response => response.json())
    .then(data => {
      console.log("Created events:", data.createdEvents);
      this.setState({ createdEvents: data.createdEvents, loading: false });
    })
    .catch(error => {
      console.error("Error sending text to backend:", error);
      this.setState({ loading: false });
    });
  };



  setFiles = (files) => {
    this.setState({ files });
  }

  render() {
    return (
      <div className="App">
        <div className="button-container">
          <FileUploadButton onFilesSelected={this.handleFilesSelected} />
        </div>

        {/* New text input area for user to paste text */}
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

        <Header data={this.state.resumeData.main} />
        <Footer data={this.state.resumeData.main} />
      </div>
    );
  }
}

export default App;
