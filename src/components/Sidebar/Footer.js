import React, {Component} from 'react';

class Footer extends Component {

  render(props) {

    return (
      <footer>
        {/* <!-- SELECT ALL --> */}
        <span className="filter-tag">
          <input id={`all-${this.props.filterName}`} className="check-all" type="radio" name={`${this.props.filterName}-select`}/>
          <label htmlFor={`all-${this.props.filterName}`}>
            <i className="nc-icon-mini ui-1_check-circle-08"></i>&nbsp;SELECT ALL</label>
        </span>
        {/* <!-- CLEAR --> */}
        <span className="filter-tag">
          <input id={`clear-${this.props.filterName}`} className="clear" type="radio" name={`${this.props.filterName}-select`}/>
          <label htmlFor={`clear-${this.props.filterName}`}>
            <i className="nc-icon-mini ui-1_circle-bold-remove"></i>&nbsp;CLEAR ALL</label>
        </span>
      </footer>
    )
  }
}

export default Footer;
