import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100)
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

class Login extends Component {

  state = {
    redirectToReferrer: false
  }

  login = () => {
    fakeAuth.authenticate(() => {
      this.setState(() => ({redirectToReferrer: true}))
      // this.props.history.push('/');
    })
  }

  render() {
    const {from} = this.props.location.state || {
      from: {
        pathname: '/'
      }
    }
    const {redirectToReferrer} = this.state

    if (redirectToReferrer === true) {
      <Redirect to='/' />
    }

    return (
    <div className="login-form">

      <div className="logo">
        <img src="images/logo.svg" alt="Marriott Logo"/>
      </div>
      <h1>Please enter your pass code:</h1>
      <form>
        <input ref={(input) => this.passCode = input} type="password" name="code"/>
        <button type="button" onClick={this.login}>
          <i className="nc-icon-outline arrows-1_tail-right"></i>
        </button>
      </form>
    </div>)
  }

}

export default Login;
