import React, {Component} from 'react';
import brandsInfo from '../../config/brands.json';

const Brand = (props) =>
  <span className={`brand ${props.brand}`} title={props.brandInfo["name"]}>
    <img src={`images/brands/brand_${props.brand}.svg`} alt={props.brandInfo["name"]} />
  </span>


class Brands extends Component {
  render() {

    const brands = this.props.brands;

    return (
      <div className="brands">
        {
          brands.map( (b, i) => <Brand key={i} brand={b} brandInfo={brandsInfo[b]} />)
        }
      </div>
    )
  }
}

export default Brands;
