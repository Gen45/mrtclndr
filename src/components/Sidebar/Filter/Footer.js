import React, {Component} from 'react';

class Footer extends Component {

  handleChange = (e, active) => {
    e.target.checked = false;
    this.props.batchChange(this.props.filters, this.props.filterName, active);
  };

  render(props) {
    return (
      <footer>
        {/* <!-- SELECT ALL --> */}
        <span className="filter-tag">
          <input id={`all-${this.props.filterName}`} className="check-all" type="checkbox" name={`${this.props.filterName}-select`}
            onChange={(e) => {
                this.handleChange(e, true)
              }} />
          <label htmlFor={`all-${this.props.filterName}`}>
            <i className="nc-icon-mini ui-1_check-circle-08"></i>&nbsp;SELECT ALL</label>
        </span>
        {/* <!-- CLEAR --> */}
        <span className="filter-tag">
          <input id={`clear-${this.props.filterName}`} className="clear" type="checkbox" name={`${this.props.filterName}-select`}
            onChange={(e) => {
                this.handleChange(e, false)
              }} />
          <label htmlFor={`clear-${this.props.filterName}`}>
            <i className="nc-icon-mini ui-1_circle-bold-remove"></i>&nbsp;CLEAR ALL</label>
        </span>
      </footer>
    )
  }
}

export default Footer;
