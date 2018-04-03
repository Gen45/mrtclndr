import React, {Component} from 'react';

import Footer from './Footer';

class Regions extends Component {

  handleChange = (event, region, active) => {
    this.props.updateRegion(region, event.target.checked);
  };

  render(props) {

    return (<div className="filter filter-wrap-regions">
      <header>
        <span className="icon icon-circle">
          <i className={this.props.titleIcon}></i>
        </span>
        <h3>{this.props.title}</h3>
      </header>
      <div className="content region-filters">
        {
          Object.keys(this.props.regions).map((r, i) => {
            const region = r.toUpperCase();
            const active = this.props.regions[r];
            return (<span key={i} className={`filter-tag region-filters ${region}`}>
              <input type="checkbox" id={`filter-${region}`} defaultChecked={active} onChange={(event)=>{ this.handleChange(event, region, active) }}/>
              <label htmlFor={`filter-${region}`}>{region}</label>
            </span>)
          })
        }
      </div>

      <Footer />



    </div>)
  }
}

export default Regions;
