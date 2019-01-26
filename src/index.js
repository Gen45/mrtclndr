import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route,
  // Redirect,
  Switch} from 'react-router-dom';
import App from './components/App';
import Help from './components/Help';
import Login from './components/Login';

import registerServiceWorker from './registerServiceWorker';

class Root extends Component {

  render() {
    return (
    <Router>
      <div>
        <Switch>
          <Route path="/login" component={Login} />
          <Route exact path='/' component={App} />
          <Route exact path='/reset-cache' component={App} />
          <Route exact path='/help' component={Help} />
        </Switch>
      </div>
    </Router>
    )
  }
}


ReactDOM.render(<Root/>, document.getElementById('root'));
registerServiceWorker();
