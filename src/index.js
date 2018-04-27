import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route,
  // Redirect,
  Switch} from 'react-router-dom';
import App from './components/App';
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
          <Route path='/:preset' component={App} />
        </Switch>
      </div>
    </Router>
    )
  }
}


ReactDOM.render(<Root/>, document.getElementById('root'));
registerServiceWorker();
