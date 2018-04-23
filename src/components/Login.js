import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'

class Login extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.passCode.value !== '') {
      this.props.history.push( `/` );
    }
  }

  render() {
    return (
      <div className="login-form">
        <div className="logo">
          <img src="images/logo.svg" alt="Marriott Logo"/>
        </div>
        <h1>Please enter your pass code:</h1>
          <form ref={(input) => this.login = input} onSubmit={(e) => this.handleSubmit(e)}>
               <input ref={(input) => this.passCode = input} type="password" name="code" />
               <button type="submit"><i className="nc-icon-outline arrows-1_tail-right"></i></button>
          </form>
      </div>
    )
  }

}

export default Login;
