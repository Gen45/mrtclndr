import React, { Component } from 'react';
import axios from 'axios';
// import {Link} from 'react-router-dom';

import { isValid } from '../helpers/misc';
import { _LOGO, _WP_URL} from '../config/constants';

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

  login = (e, segment) => {

    this.setState({loading: true});

    e.preventDefault();

    const self = this;

    const auth = {
      username: segment === 'cala' ? this.username_cala.value : this.username.value,
      password: segment === 'cala' ? this.passCode_cala.value : this.passCode.value
    };

    axios({
      method: 'post',
      url: _WP_URL + "/wp-json/jwt-auth/v1/token/",
      data: auth
    }).then(function (response) {

      if(response.status === 200){

        const token = response.data.token;
        sessionStorage.setItem('auth-mrt', token);
        self.setState({error : false});
        const key = isValid(self.from) ? self.from.key : '';
        // console.log(response);
        self.props.history.push(self.from.path, { isAuthenticated: true, key, cala: segment === 'cala'});

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

      <div className="login-forms">
          <form onSubmit={(e) => this.login(e, 'general')}>
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

            <p className="error">{this.state.error ? 'Invalid information, please try again.' : <br />}</p>
          </form>

          <br />
          <br />
          <br />

          <div className="guest-login">
            <h2>CALA Guest</h2>

            <form onSubmit={(e) => this.login(e, 'cala')}>
              <input ref={(input) => this.username_cala = input} defaultValue="CALA_GUEST" type="hidden" name="Username" autoComplete="Username" />
              <input ref={(input) => this.passCode_cala = input} placeholder="Password" type="password" name="code" autoComplete="passCode" />
              <button type="submit" className={this.state.error === true ? 'error' : ''}>
                {
                  !this.state.loading
                    ?
                    <i className="nc-icon-outline arrows-1_tail-right"></i>
                    :
                    <i className="nc-icon-outline arrows-1_refresh-69 circle-anim"></i>
                }
              </button>
            </form>
          </div>
          <p className="error">{this.state.error ? 'Invalid information, please try again.' : <br />}</p>
          <br/>
          <p><a target="_blank" rel="noopener noreferrer" href="http://marriottcalendar.com/backend/wp-login.php?action=lostpassword" style={{ color: 'white', fontSize: 12 }}>Forgot your password?</a> 
            {/* | <Link style={{ color: 'white', fontSize: 12 }} to="/help">Help</Link> */}
          </p>



      </div>
 
    </div>)
  }
}

export default Login;
