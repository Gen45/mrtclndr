import React, {Component} from 'react';

import Footer from './Footer';

class Brands extends Component {

  handleChange = (event, brand, active) => {
    this.props.updateFilters(brand, "brands", event.target.checked);
  };

  render() {

    return (<div className="filter filter-wrap-brands">
      <header>
        <span className="icon icon-circle">
          <i className={this.props.titleIcon}></i>
        </span>
        <h3>{this.props.title}</h3>
      </header>
      <div className="content brands-filters">
        {
          Object.keys(this.props.brands).map((r, i) => {
            const brand = r.toUpperCase();
            const active = this.props.brands[r];
            return (<span key={i} className={`filter-tag brand-filters ${brand}`}>
              <input type="checkbox" id={`filter-${brand}`} checked={active} onChange={(event)=>{ this.handleChange(event, brand, active) }}/>
              <label htmlFor={`filter-${brand}`}>{brand}</label>
            </span>)
          })
        }
      </div>

      <Footer />

    </div>)
  }
}

export default Brands;
