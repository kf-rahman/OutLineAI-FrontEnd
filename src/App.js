import React, { Component } from "react";
import ReactGA from "react-ga";
import $ from "jquery";
import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import DragNDrop from "./Components/DragNDrop";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foo: "bar",
      resumeData: {},
      files:[]

    };

    ReactGA.initialize("UA-110570651-1");
    ReactGA.pageview(window.location.pathname);
  }

  getResumeData() {
    $.ajax({
      url: "./resumeData.json",
      dataType: "json",
      cache: false,
      success: function(data) {
        this.setState({ resumeData: data });
      }.bind(this),
      error: function(xhr, status, err) {
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
        <Header data={this.state.resumeData.main} />
        <div className='section'>
    // other jsx
     <DragNDrop onFilesSelected={this.setFiles} width="300px" height='400px'/>
    // other jsx
    </div>
        <Footer data={this.state.resumeData.main} />
      </div>
    );
  }
}

export default App;
