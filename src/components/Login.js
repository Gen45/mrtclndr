import React, {Component} from 'react';

import {isValid} from '../helpers/misc';

class Login extends Component {

  state = {
    error: false
  }

  passCodes = {" " : 'ALL', "Mrt16!" : 'ALL', "WEST17!" : 'US-WEST', "east17!" : 'US-EAST', "Canada!!" : 'CANADA', "Cala17!" : 'CALA'};

  componentDidMount(){
    if(this.props.location.state.from){
      this.from = [this.props.location.state.from, ...this.disectFrom(this.props.location.state.from)];
      // console.log(this.from);
    } else {
      this.from = ['/', '', ''];
    }
  }

  disectFrom = from => from.split('/').splice(1, 2);

  login = (e) => {
    e.preventDefault();

    const codeIndex = Object.keys(this.passCodes).indexOf(this.passCode.value);
    const preset = Object.values(this.passCodes)[codeIndex];

    if(codeIndex > -1){
      this.setState({error : false});
      const configKey = isValid(this.from)
        ? this.from[1].toUpperCase() === preset
          ? this.from[2]
          : ''
        : '';
      this.props.history.push(this.from[0], {isAuthenticated: true, preset, configKey});
    } else {
      this.setState({error : true});
    }
  };

  render() {

    return (
    <div className="login-form">
      <div className="logo">
        <img src="/images/logo.svg" alt="Marriott Logo"/>
      </div>
      <h1>Please enter your pass code:</h1>
      <form onSubmit={(e) => this.login(e)}>
        <input ref={(input) => this.passCode = input} type="password" name="code" autoComplete="passCode" />
        <button type="submit" className={this.state.error === true ? 'error' : ''}>
          <i className="nc-icon-outline arrows-1_tail-right"></i>
        </button>
          <p style={{paddingTop: 20}}>{this.state.error ? 'Please enter a valid Code' : <br/>}</p>

      </form>
    </div>)
  }
}

export default Login;
