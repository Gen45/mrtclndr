import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import {_LOGO} from '../../config/constants';



class Header extends Component {

  newEntry = () => window.open('http://admin.marriottcalendar.com/wp-admin/post-new.php?post_type=entry', '_blank');

  render() {

    return (
      <header className="header" role="banner">
        <div className="logo">
          <Link to="/"><img src={_LOGO.URL} alt={_LOGO.ALT} /></Link>
        </div>
        <div className="buttons">
          {
            this.props.canCreate &&
            <a className="addEntry" onClick={this.props.addEntry}>
              <i className="nc-icon-mini ui-1_bold-add" />
              <span>
                Add Entry
            </span>
            </a>
          }

          {
            !this.props.noLogout &&
            <a className="logout" onClick={this.props.logout}>
              <i className="nc-icon-outline media-1_button-power" />
              <span>
                Log Out
            </span>
            </a>
          }
        </div>

      
      </header>
    )
  }
}

export default Header;
