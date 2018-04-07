import React, {Component} from 'react';

import Footer from './Footer';

class Filters extends Component {

  handleChange = (event, filter, active) => {
    this.props.updateFilter(filter, this.props.filterName, event.target.checked);
  };

  render() {

    return (<div className="filter">
      <header>
        <span className="icon icon-circle">
          <i className={this.props.titleIcon}></i>
        </span>
        <h3>{this.props.title}</h3>
      </header>
      <div className="content">
        {
          Object.keys(this.props.filters).map((r, i) => {
            const filter = r.toUpperCase();
            const active = this.props.filters[r];
            return (<span key={i} className={`filter-tag ${filter}`}>
              <input type="checkbox" id={`filter-${filter}`} checked={active} onChange={(event)=>{ this.handleChange(event, filter, active) }}/>
              <label htmlFor={`filter-${filter}`}>{filter}</label>
            </span>)
          })
        }
      </div>
      <Footer filterName={this.props.filterName} />
    </div>)
  }
}

export default Filters;
