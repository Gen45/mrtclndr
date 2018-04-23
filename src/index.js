import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from './components/App';
import Login from './components/Login';
// import Login from './components/Login';

// import registerServiceWorker from './registerServiceWorker';

const Root = () => {
  return (

    <Router>
      <div>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={App} />
        </Switch>
      </div>
    </Router>
  )
}



ReactDOM.render(<Root />, document.getElementById('root'));
// registerServiceWorker();
