import React, {Component} from 'react';
import brandsInfo from '../../config/brands.json';

const Brand = (props) =>
  <span className={`brand ${props.brand}`} title={props.brandInfo}>
    <img src={`images/brands/brand_${props.brand}.svg`} alt={props.brandInfo} />
  </span>


class Brands extends Component {
  render() {

    // const brands = Object.entries(this.props.brands).filter(c => c[1] != null).map(c => c[0]);
    const brands = this.props.brands;
    // console.log(brandsInfo);

    return (
      <div className="brands">
        {
          brands.map( (b, i) => <Brand key={i} brand={b} brandInfo={brandsInfo[b]} />)
        }

        {/* <span className="brand <?php if ($brand == "NONE" || $brand == "PM" || $brand == "UN" ) { echo ' hidden ';} ?>" title="<?php echo $brands_names[$brand]; ?>" data-filter="<?php echo $brand; ?>">
          <span className="name hidden" ><?php echo in_array($brand, $unbranded) ? $brand : $brands_names[$brand]; ?></span>
          <?php if ($brand != "TX" || $brand != "GX") { ?>
          <img src="<?php echo "assets/img/svg/brand_".$brand.".svg"; ?>" alt="<?php echo in_array($brand, $unbranded) ? $brand : $brands_names[$brand]; ?>" />  <?php } ?>
        </span> */}
      </div>
    )
  }
}

export default Brands;
