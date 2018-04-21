import React, {Component} from 'react';

class Header extends Component {

  render() {
    return (<header onClick={() => {
        this.props.handleCollapse();
      }}>
      <span className="icon icon-circle">
        <i className={this.props.icon}></i>
      </span>
      <h3>{this.props.title}</h3>
    </header>);
  }
}

export default Header;
