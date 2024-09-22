import React, { Component } from "react";
import ReactGA from "react-ga";
import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import FileUploadButton from "./Components/DragNDrop";
import { fetchLLMOutput } from "./api/llmtest";  // Import the function to call the LLM from llmtest.js

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      textInput: "",
      loading: false,
      llmOutput: ""  // Store LLM output
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

  // Function to handle submission of the text to the LLM (through the function in llmtest.js)
  handleSubmitText = () => {
    this.setState({ loading: true });

    // Call the LLM API with the input text
    fetchLLMOutput(this.state.textInput)
      .then((output) => {
        console.log("LLM Output:", output);
        this.setState({ llmOutput: output, loading: false });
      })
      .catch((error) => {
        console.error("Error fetching LLM output:", error);
        this.setState({ loading: false });
      });
  };

  render() {
    return (
      <div className="App">
        <div className="button-container">
          <FileUploadButton onFilesSelected={this.handleFilesSelected} />
        </div>

        {/* Text input and submit button */}
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

        {/* Display the LLM output */}
        {this.state.llmOutput && (
          <div className="llm-output-container">
            <h3>LLM Output:</h3>
            <p>{this.state.llmOutput}</p>
          </div>
        )}

        <Header />
        <Footer />
      </div>
    );
  }
}

export default App;
