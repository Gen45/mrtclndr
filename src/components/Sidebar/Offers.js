import React, {Component} from 'react';

import Footer from './Footer';

class Offers extends Component {

  handleChange = (event, offer, active) => {
    this.props.updateOffer(offer, event.target.checked);
  };

  render() {

    return (<div className="filter filter-wrap-offers">
      <header>
        <span className="icon icon-circle">
          <i className={this.props.titleIcon}></i>
        </span>
        <h3>{this.props.title}</h3>
      </header>
      <div className="content offer-filters">
        {
          Object.keys(this.props.offers).map((r, i) => {
            const offer = r.toUpperCase();
            const active = this.props.offers[r];
            return (<span key={i} className={`filter-tag offer-filters ${offer}`}>
              <input type="checkbox" id={`filter-${offer}`} checked={active} onChange={(event)=>{ this.handleChange(event, offer, active) }}/>
              <label htmlFor={`filter-${offer}`}>{offer}</label>
            </span>)
          })
        }
      </div>

      <Footer />



    </div>)
  }
}

export default Offers;
