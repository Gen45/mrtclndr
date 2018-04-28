import React, {Component} from 'react';

import {isValid} from '../helpers/misc';
import {_LOGO, _PASSCODES} from '../config/constants';

class Login extends Component {

  state = {
    error: false
  }

  componentDidMount(){
    if(this.props.location.state.from){
      this.from = {path: this.props.location.state.from, preset: this.disectFrom(this.props.location.state.from)[0] || '', key: this.disectFrom(this.props.location.state.from)[1] || ''};
      // console.log(this.from);
    } else {
      this.from = {path: '/', preset: '', key: ''};
    }
  }

  disectFrom = from => from.split('/').splice(1, 2);

  login = (e) => {
    e.preventDefault();

    const codeIndex = Object.keys(_PASSCODES).indexOf(this.passCode.value);
    const preset = Object.values(_PASSCODES)[codeIndex];

    if(codeIndex > -1){
      this.setState({error : false});
      const key = isValid(this.from)
        ? this.from.preset.toUpperCase() === preset
          ? this.from.key
          : ''
        : '';
      this.props.history.push(this.from.path, {isAuthenticated: true, preset, key});
    } else {
      this.setState({error : true});
    }
  };

  render() {

    return (
    <div className="login-form">
      <div className="logo">
        <img src={_LOGO.URL} alt={_LOGO.ALT}/>
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
