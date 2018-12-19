import React, { Component } from 'react';
import axios from 'axios';

import { isValid } from '../helpers/misc';
import { _LOGO, _WP_URL} from '../config/constants';
import { today } from '../helpers/dates';

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

    const preset = 'ALL'; 

    const self = this;

    const auth = {
      username: this.username.value,
      password: this.passCode.value
    };

    axios({
      method: 'get',
      url: _WP_URL + "/wp-json/wp/v2/users/",
      auth
    }).then(function (response) {

      
      if(response.status === 200){

        const authStr = btoa(JSON.stringify(auth));
        localStorage.setItem(`auth-${today()}`, authStr); 

        self.setState({error : false});
        
        const key = isValid(self.from)
          ? self.from.preset.toUpperCase() === 'CALA'//preset
            ? self.from.key
            : ''
          : '';
        self.props.history.push(self.from.path, { isAuthenticated: true, preset, key, auth: auth });
      } else {
        self.setState({error : true});
      }

    })
    .catch(function (error) {
      self.setState({ error: true });
      // console.log('failed', error);
    });

  };

  render() {

    return (
    <div className="login-form">
      <div className="logo">
        <img src={_LOGO.URL} alt={_LOGO.ALT}/>
      </div>
      <h1>Please enter your pass code:</h1>
      <form onSubmit={(e) => this.login(e)}>
          <input ref={(input) => this.username = input} placeholder="User Name" type="text" name="Username" autoComplete="Username" />
          <input ref={(input) => this.passCode = input} placeholder="Password" type="password" name="code" autoComplete="passCode" />
        <button type="submit" className={this.state.error === true ? 'error' : ''}>
          <i className="nc-icon-outline arrows-1_tail-right"></i>
        </button>
          <p style={{paddingTop: 20}}>{this.state.error ? 'Please enter a valid Code' : <br/>}</p>
      </form>
    </div>)
  }
}

export default Login;
