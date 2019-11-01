import React, { Component } from "react";
import { ZoomMtg } from "zoomus-jssdk";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meetingLaunched: false,
      meetingNumber: "",
      leaveUrl: "#",
      userName: "",
      userEmail: "",
      passWord: "",
      role: 0
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.launchMeeting = this.launchMeeting.bind(this);
    this.getSignature = this.getSignature.bind(this);
  }

  componentDidMount() {
    ZoomMtg.setZoomJSLib("https://source.zoom.us/1.6.0/lib", "/av");
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();
  }

  handleInputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  launchMeeting() {
    const apiKey = "veVac3ZTQ_-OrSGXQh3oPA";
    const meetConfig = {
      meetingNumber: this.state.meetingNumber,
      leaveUrl: this.state.leaveUrl,
      userName: this.state.userName,
      userEmail: this.state.userEmail,
      passWord: this.state.passWord,
      role: this.state.role
    };
    this.setState({ meetingLaunched: true });
    this.getSignature(meetConfig, apiKey);
  }

  getSignature(meetConfig, apiKey) {
    fetch("http://localhost:4000/getSignature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meetingData: meetConfig })
    })
      .then(result => result.text())
      .then(response => {
        ZoomMtg.init({
          leaveUrl: meetConfig.leaveUrl,
          isSupportAV: true,
          success: function() {
            ZoomMtg.join({
              signature: response,
              apiKey: apiKey,
              meetingNumber: meetConfig.meetingNumber, // required
              userName: meetConfig.userName, // required
              userEmail: meetConfig.userEmail, // Not used, required for Webinars
              passWord: meetConfig.passWord, // If required; set by host
              success() {
                console.log("join meeting success");
              },
              error(res) {
                console.log(res);
              }
            });
          },
          error(res) {
            console.log(res);
          }
        });
      });
  }

  render() {
    const { meetingNumber, userName, passWord, meetingLaunched } = this.state;
    return (
      <div className="App">
        {!meetingLaunched ? (
          <nav className="app-nav">
            <form className="form">
              <label>
                <span>MeetingID:</span>
                <input
                  className="form__input"
                  type="text"
                  name="meetingNumber"
                  placeholder="Meeting #"
                  value={meetingNumber}
                  onChange={this.handleInputChange}
                />
              </label>
              <label>
                <span>Username:</span>
                <input
                  className="form__input"
                  type="text"
                  name="userName"
                  placeholder="Username"
                  value={userName}
                  onChange={this.handleInputChange}
                />
              </label>
              <label>
                <span>Password:</span>
                <input
                  className="form__input"
                  type="text"
                  name="passWord"
                  placeholder="Password"
                  value={passWord}
                  onChange={this.handleInputChange}
                />
              </label>
            </form>
            <div className="button-wrap">
              <button onClick={this.launchMeeting} className="button">
                Launch Meeting
              </button>
            </div>
          </nav>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default App;
