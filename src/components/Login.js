import React, {Component} from 'react';

class Login extends Component {

  state = {
    passCode: 'hola',
    error: false
  }

  componentWillMount() {
    console.log(this.props);
  }

  login = (e) => {
    e.preventDefault();
    if(this.passCode.value === this.state.passCode){
      this.setState({error : false});
      this.props.history.push('/', {isAuthenticated : true});
    } else {
      this.setState({error : true});
    }
  };

  render() {

    return (
    <div className="login-form">
      <div className="logo">
        <img src="images/logo.svg" alt="Marriott Logo"/>
      </div>
      <h1>Please enter your pass code:</h1>
      <form onSubmit={(e) => this.login(e)}>
        <input ref={(input) => this.passCode = input} type="password" name="code"/>
        <button type="submit" className={this.state.error === true ? 'error' : ''}>
          <i className="nc-icon-outline arrows-1_tail-right"></i>
        </button>
          <p style={{paddingTop: 20}}>{this.state.error ? 'Please enter a valid Code' : <br/>}</p>

      </form>
    </div>)
  }
}

export default Login;
