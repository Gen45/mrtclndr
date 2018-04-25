import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import App from './components/App';
import Login from './components/Login';

// import registerServiceWorker from './registerServiceWorker';

// const fakeAuth = {
//   isAuthenticated: false,
//   authenticate(cb) {
//     this.isAuthenticated = true
//     setTimeout(cb, 100)
//   },
//   signout(cb) {
//     this.isAuthenticated = false
//     setTimeout(cb, 100)
//   }
// }

class Root extends Component {


  render() {

    console.log(this.props);
    
    return (
    <Router>
      <div>
        <Switch>
          <Route path="/login" component={Login} />
          <PrivateRoute exact path='/' component={App} />
        </Switch>
      </div>
    </Router>
    )
  }
}

const PrivateRoute = ({component: Component,  ...rest}) =>
(
  <Route {...rest} render={(props) =>
    (
      fakeAuth.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to={{ pathname: '/login', state: { from: props.location, ola: 'ke ase' } }}/>
    )}
  />
)


ReactDOM.render(<Root/>, document.getElementById('root'));
// registerServiceWorker();
