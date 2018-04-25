import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import App from './components/App';
// import Login from './components/Login';

// import registerServiceWorker from './registerServiceWorker';

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

class Root extends Component {

  render() {
    return (<Router>
      <div>
        <Switch>
          <Route path="/login" component={Login}/>
          <PrivateRoute exact path='/' component={App}/>
        </Switch>
      </div>
    </Router>)
  }
}

const PrivateRoute = ({  component: Component,  ...rest}) =>
(
  <Route {...rest} render={(props) =>
    (
      fakeAuth.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to={{ pathname: '/login', state: { from: props.location } }}/>
    )}
  />
)

class Login extends Component {

  state = {
    redirectToReferrer: false
  }

  login = () => {
    fakeAuth.authenticate(() => {
      this.setState(() => ({redirectToReferrer: true}))
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
      <Redirect to={from} />
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

ReactDOM.render(<Root/>, document.getElementById('root'));
// registerServiceWorker();
