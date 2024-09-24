import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textInput: '',
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
      try {
        const response = await fetch('/extract-and-add-eventss', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log(response.headers.get('Content-Type')); // Should be 'application/json'



        //const data = await response.json();
        console.log('Response:', response);
        alert('Events added successfully!');
      } catch (error) {
        console.error('Error submitting text:', error);
        alert('Failed to add events');
      }
    } else {
      alert('Please enter some text.');
    }
  };

  render() {
    const { textInput } = this.state;

    return (
      <div className="App">
        <div className="button-container">
          {/* File upload component if you have it */}
          {/* <FileUploadButton onFilesSelected={this.handleFilesSelected} /> */}
        </div>

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
          <button onClick={this.handleSubmit}>Submit</button>
        </div>
      </div>
    );
  }
}

export default App;
