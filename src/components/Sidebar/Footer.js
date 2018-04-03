import React, {Component} from 'react';

class Footer extends Component {

  handleChange = (event, region, active) => {
    this.props.updateRegion(region, event.target.checked);
  };

  render(props) {

    return (
      <footer>
        {/* <!-- SELECT ALL --> */}
        <span className="filter-tag">
          <input id="all-region" className="check-all" type="radio" name="region-select"/>
          <label htmlFor="all-region">
            <i className="nc-icon-mini ui-1_check-circle-08"></i>&nbsp;SELECT ALL</label>
        </span>
        {/* <!-- CLEAR --> */}
        <span className="filter-tag">
          <input id="clear-region" className="clear" type="radio" name="region-select"/>
          <label htmlFor="clear-region">
            <i className="nc-icon-mini ui-1_circle-bold-remove"></i>&nbsp;CLEAR ALL</label>
        </span>
      </footer>
    )
  }
}

export default Footer;
