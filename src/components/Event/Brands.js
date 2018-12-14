import React, {Component} from 'react';
import { Tooltip } from 'react-tippy';
import Select from 'react-select';

const Brand = (props) => {
  return (
    <span className={`brand ${props.brand}${props.editable ? ' editable-field' : ''} `} title={props.brandsInfo[props.brand]["name"]} onClick={(e) => props.removeBrand(props.brand, props.event, props.editable)}>
      <img src={props.brandsInfo[props.brand]["image"]} alt={props.brandsInfo[props.brand]["name"]} />
    </span>
  )
}

class Brands extends Component {

  addBrand = () => {
    console.log('hey that\'s my bike');
  }

  removeBrand = (id, event, editable) => {

    if (editable) {
      const index = event.brands.indexOf(id);
      console.log(event.brands);
      if (index > -1) {
        event.brands.splice(index, 1);
      } else {
        event.brands.push(id);
      }
      console.log(event.brands);
      this.setState({change: true});
    }
  }

  render() {
    const brands = this.props.brands;

    return (
      <div className="brands">
        {
          brands.map((b, i) => <Brand key={i} brand={b} brandsInfo={this.props.brandsInfo} editable={this.props.editable} event={this.props.event} removeBrand={this.removeBrand} />)
        }
        {
          this.props.editable && 
          <Tooltip key={999} title={'Add Brands'} delay={0} arrow={true} distance={10} theme="light" size="big" trigger="click" interactive
                html={(<div>hola</div> )} >
            <span className="brand add-brand editable-field" title="add brand" onClick={(e) => { this.addBrand() }}> <i className="nc-icon-mini ui-1_simple-add"></i> </span>
          </Tooltip>
            
        }
      </div>
    )
  }
}

export default Brands;
