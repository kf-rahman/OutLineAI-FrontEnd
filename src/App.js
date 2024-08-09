import React, { Component } from "react";
import ReactGA from "react-ga";
import $ from "jquery";
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
      files: []
    };

    ReactGA.initialize("UA-110570651-1");
    ReactGA.pageview(window.location.pathname);
  }

  handleFilesSelected = (files) => {
    console.log("Selected files:", files);
  };

  getResumeData() {
    $.ajax({
      url: "./resumeData.json",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ resumeData: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.log(err);
        alert(err);
      }
    });
  }

  componentDidMount() {
    this.getResumeData();
  }

  setFiles = (files) => {
    this.setState({ files }); // Use this.setState to update the files array
  }

  render() {
    return (
      <div className="App">
        <div className="button-container">
          {/* Other JSX */}
          <FileUploadButton onFilesSelected={this.handleFilesSelected} />
          {/* Other JSX */}
        </div>
        <Header data={this.state.resumeData.main} />
        <Footer data={this.state.resumeData.main} />
      </div>
    );
  }
}

export default App;
