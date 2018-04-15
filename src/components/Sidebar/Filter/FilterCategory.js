import React from 'react';

class FilterCategory extends Component {

  render() {
    return (
    // <span className="filter-tag ALL-BRANDS">
    //     <input name="brand-cat" id="filter-ALL-BRANDS" type="radio" className="b-filter" data-cat="#LUXURY, #PREMIUM, #SELECT, #LONGER-S, #REWARD, #OTHER"/>
    //     <label htmlFor="filter-ALL-BRANDS">ALL <span className="parenthesis">0</span></label>
    // </span>
    <span className={`filter-tag ${this.props.category}`}>
      <input name="brand-cat" id={`filter-${this.props.category}`} type="radio" className="b-filter"/>
      <label htmlFor={`filter-${this.props.category}`}>{this.props.category}
        <span className="parenthesis">0</span>
      </label>
    </span>);
  }
}

export default FilterCategory;
