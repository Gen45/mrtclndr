import React, {Component} from 'react';


class Channels extends Component {
  render() {
    return (
      <div className="filter search">
          <div className="search-filter">
              <div className="input-icon">
                  <input id="search_box" className="search-box" type="text" placeholder="Search..." />
                  <i className="nc-icon-mini ui-1_zoom"></i>
              </div>
          </div>
      </div>
    )
  }
}

export default Channels;
