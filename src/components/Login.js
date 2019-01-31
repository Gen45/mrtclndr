import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

import { isValid } from '../helpers/misc';
import { _LOGO, _WP_URL} from '../config/constants';
import { today } from '../helpers/dates';

class Login extends Component {

  state = {
    error: false,
    loading: false
  }

  componentDidMount(){

    if (this.props.location.state) {
      if( this.props.location.state.from){
        this.from = {path: this.props.location.state.from};
      } else {
        this.from = {path: '/'};
      } 
    } else {
      this.props.history.push('/');
    }
  }

  login = (e) => {

    this.setState({loading: true});

    e.preventDefault();

    const self = this;

    const auth = {
      username: this.username.value,
      password: this.passCode.value
    };

    axios({
      method: 'post',
      url: _WP_URL + "/wp-json/jwt-auth/v1/token/",
      data: auth
    }).then(function (response) {

      if(response.status === 200){

        const token = response.data.token;
        sessionStorage.setItem('auth-'+today(), token);
        self.setState({error : false});
        const key = isValid(self.from) ? self.from.key : '';
        // console.log(response);
        self.props.history.push(self.from.path, { isAuthenticated: true, key });

      } else {
        self.setState({error: true, loading: false});
      }

    }).catch(function (error) {
      self.setState({ error: true, loading: false });
      console.log('failed', error);
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
          {
            !this.state.loading 
            ?
              <i className="nc-icon-outline arrows-1_tail-right"></i>
            :
              <i className="nc-icon-outline arrows-1_refresh-69 circle-anim"></i>
          }
            </button>

          <p style={{paddingTop: 20}}>{this.state.error ? 'Invalid information, please try again.' : <br/>}</p>
          <p><a target="_blank" rel="noopener noreferrer" href="https://marriottcalendar.com/backend/wp-login.php?action=lostpassword" style={{ color: 'white', fontSize: 12 }}>Lost your Password?</a> | <Link style={{ color: 'white', fontSize: 12 }} to="/help">Help</Link></p>
      </form>
    </div>)
  }
}

export default Login;
