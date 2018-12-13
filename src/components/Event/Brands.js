import React, {Component} from 'react';
// import { Tooltip } from 'react-tippy';
// import Select from 'react-select';
// import brandsInfo from '../../config/brands.json';

const Brand = (props) => {

  return (
    <span className={`brand ${props.brand}${props.editable ? ' editable-field': ''} `} title={props.brandsInfo[props.brand]["name"]}>
      <img src={props.brandsInfo[props.brand]["image"]} alt={props.brandsInfo[props.brand]["name"]} />
    </span>
  )
  
}


class Brands extends Component {

  render() {
    const brands = this.props.brands;
    // console.log(brands);

    return (
      <div className="brands">
        {
          brands.map((b, i) => <Brand key={i} brand={b} brandsInfo={this.props.brandsInfo} editable={this.props.editable} />)
        }
        {
          this.props.editable && 
            <span className="brand add-brand editable-field" title="add brand"> <i className="nc-icon-mini ui-1_simple-add"></i> </span>
        }
      </div>
    )
  }
}

export default Brands;
