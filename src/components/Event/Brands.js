import React, {Component} from 'react';
// import brandsInfo from '../../config/brands.json';

const Brand = (props) => {
  // console.log(props);

  return <span className={`brand ${props.brand}`} title={props.brandsInfo[props.brand]["name"]}>
      <img src={props.brandsInfo[props.brand]["image"]} alt={props.brandsInfo[props.brand]["name"]} />
    </span>
  
}


class Brands extends Component {

  render() {
    const brands = this.props.brands;
    // console.log(brands);

    return (
      <div className="brands">
        {
          brands.map((b, i) => <Brand key={i} brand={b} brandsInfo={this.props.brandsInfo} />)
        }
      </div>
    )
  }
}

export default Brands;
