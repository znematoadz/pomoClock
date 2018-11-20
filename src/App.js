import React from 'react';
import './App.css';

class Break extends React.Component {
  render() {
    return (
      <div id="break" className="col-6 text-center pb-3 pt-3">
        <p id="break-label" className="lead shadow">
          Break Length
        </p>
        <button
          id="break-increment"
          className="btn fa fa-arrow-up"
          onClick={this.props.click}
        />
        <h5 id="break-length" className="p-1">
          {this.props.value}
        </h5>
        <button
          id="break-decrement"
          className="btn fa fa-arrow-down"
          onClick={this.props.click}
        />
      </div>
    );
  }
}

class Session extends React.Component {
  render() {
    return (
      <div id="session" className="col-6 text-center pb-3 pt-3">
        <p id="session-label" className="lead shadow">
          Session Length
        </p>
        <button
          id="session-increment"
          className="btn fa fa-arrow-up"
          onClick={this.props.click}
        />
        <h5 id="session-length" className="p-1">
          {this.props.value}
        </h5>
        <button
          id="session-decrement"
          className="btn fa fa-arrow-down"
          onClick={this.props.click}
        />
      </div>
    );
  }
}

class Timer extends React.Component {
  render() {
    return (
      <div className="col-12 text-center p-3 ">
        <h1 id="timer-label" className="lead shadow">
          {this.props.labels}
        </h1>
        <h1 id="time-left" className="" style={this.props.style}>
          {this.props.clock}
        </h1>
        <button
          id="start_stop"
          className={this.props.startStop}
          onClick={this.props.click}
        />
        <button
          id="reset"
          className={this.props.resetBtn}
          onClick={this.props.click}
        />
      </div>
    );
  }
}

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 1500,
      break: 5,
      session: 25,
      timerLabel: "Session",
      startStop: "btn fa fa-play fa-2x",
      isPaused: true,
      resetBtn: "btn fa fa-refresh fa-2x",
      intervalID: "",
      warningColor: { color: "#000" }
    };

    this.handleClick = this.handleClick.bind(this);
    this.beginTimer = this.beginTimer.bind(this);
    this.countdown = this.countdown.bind(this);
    this.handleTime = this.handleTime.bind(this);
    this.timerSwitch = this.timerSwitch.bind(this);
    this.warning = this.warning.bind(this);
    this.alarm = this.alarm.bind(this);
    this.addTimer = this.addTimer.bind(this);
    this.subtractTimer = this.subtractTimer.bind(this);
  }

  handleClick = e => {
    const value = e.target.getAttribute("id");
    switch (value) {  
      case "break-decrement":
        if (this.state.break > 1) {
          this.setState({ break: this.state.break - 1 });
          if (this.state.timerLabel === "Break") {
            this.subtractTimer();
          }
        }
        break;
      case "break-increment":
        if (this.state.break < 60) {
          this.setState({ break: this.state.break + 1 });
          if (this.state.timerLabel === "Break") {
            this.addTimer();
          }
        }
        break;
      case "session-decrement":
        if (this.state.session > 1) {
          this.setState({ session: this.state.session - 1 });
          if (this.state.timerLabel === "Session") {
            this.subtractTimer();
          }
        }
        break;
      case "session-increment":
        if (this.state.session < 60) {
          this.setState({ session: this.state.session + 1 });
          if (this.state.timerLabel === "Session") {
            this.addTimer();
          }
        }
        break;
      case "start_stop":
      // eslint-disable-next-line
        const pause = this.state.isPaused
          ? (this.beginTimer(),
            this.setState({
              isPaused: false,
              startStop: "btn fa fa-pause fa-2x"
            }))
          : (this.setState({
              isPaused: true,
              startStop: "btn fa fa-play fa-2x"
            }),
            clearInterval(this.state.intervalID));
        break;
        default:
        this.setState({
          timer: 1500,
          break: 5,
          session: 25,
          timerLabel: "Session",
          startStop: "btn fa fa-play fa-2x",
          isPaused: true,
          intervalID: "",
          warningColor: { color: "#000" }
        });
        clearInterval(this.state.intervalID);
        this.alarmSound.pause();
        this.alarmSound.currentTime = 0;
        break;
    }
  };

  beginTimer() {
    this.setState({
      intervalID: setInterval(() => {
        this.countdown();
        this.timerSwitch();
      }, 1000)
    });
  }

  countdown() {
    this.setState({ timer: this.state.timer - 1 });
  }

  handleTime() {
    let minutes = Math.floor(this.state.timer / 60);
    let seconds = this.state.timer - minutes * 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return minutes + ":" + seconds;
  }

  timerSwitch() {
    let timer = this.state.timer;
    this.warning(timer);
    this.alarm(timer);
    if (timer < 0) { 
      // eslint-disable-next-line
      const switchPhase = this.state.timerLabel === "Session" ? 
      (
        clearInterval(this.state.intervalID), 
        this.setState({ 
          timerLabel: "Break", 
          timer: this.state.break * 60 
        }), 
        this.beginTimer()
      ) : (
        clearInterval(this.state.intervalID), 
        this.setState({ 
          timerLabel: "Session", 
          timer: this.state.session * 60
        }), 
        this.beginTimer()
        );
      };
  }

  warning(timeLeft) {
      timeLeft < 61
        ? this.setState({ warningColor: { color: "#BD3D3A" } })
        : this.setState({ warningColor: { color: "#000" } });
  }

  alarm(timeLeft) {
    if (timeLeft < 20) {
      this.alarmSound.play();
    }
  }

  addTimer() {
    this.setState({ timer: this.state.timer + 60 });
  }

  subtractTimer() {
    this.setState({ timer: this.state.timer - 60 });
  }

  render() {
    return (
      <div className="row">
        <Timer
          labels={this.state.timerLabel}
          clock={this.handleTime()}
          startStop={this.state.startStop}
          resetBtn={this.state.resetBtn}
          click={this.handleClick}
          style={this.state.warningColor}
        />
        <Session value={this.state.session} click={this.handleClick} />
        <Break value={this.state.break} click={this.handleClick} />
        <audio
          id="beep"
          preload="auto"
          src="https://actions.google.com/sounds/v1/emergency/beeper_emergency_call.ogg"
          ref={audio => {
            this.alarmSound = audio;
          }}
        />
          
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/znematoadz"><span className="m-2 fa fa-github fa-2x fixed-bottom text-center"></span></a>
        
      </div>
    );
  }
}



export default Clock;
