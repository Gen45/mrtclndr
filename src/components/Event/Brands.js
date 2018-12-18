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

  removeBrand = (id, event, editable) => {
    if (editable) {
      const index = event.brands.indexOf(id);
      // console.log(event.brands);
      if (index > -1) {
        event.brands.splice(index, 1);
      } else {
        event.brands.push(id);
      }
      // console.log(event.brands);
      this.setState({change: true});
    }
  }

  render() {
    const brands = this.props.brands;

    return (
      <div className="brands">
        {
          this.props.editingBrands &&
          <div style={{display: 'block', width: '100%', margin: '10px 0', textAlign:'center', color: '#FFFFFF'}}> Unassigned Brands </div>
        }
        {
          this.props.editingBrands &&
          Object.keys(this.props.brandsInfo).filter((b) => brands.indexOf(this.props.brandsInfo[b].id) < 0).map((b, i) => <Brand key={i} brand={this.props.brandsInfo[b].id} brandsInfo={this.props.brandsInfo} editable={this.props.editable} event={this.props.event} removeBrand={this.removeBrand} />)
        }
        {
          this.props.editingBrands &&
          <div style={{display: 'block', width: '100%', margin: '10px 0', textAlign:'center', color: '#FFFFFF'}}> Assigned Brands </div>
        }
        {
          brands.map((b, i) => <Brand key={i} brand={b} brandsInfo={this.props.brandsInfo} editable={this.props.editingBrands} event={this.props.event} removeBrand={this.removeBrand} />)
        }
        {
          this.props.editable && !this.props.editingBrands &&
          <span className=" add-brand editable-field" title="add brand" onClick={() => { this.props.editBrands(true) }}> <i className="nc-icon-mini ui-1_pencil"></i> </span>            
        }
        {
          this.props.editingBrands &&
          <div style={{display: 'block', width: '100%', margin: '10px 0', textAlign:'center', color: '#FFFFFF'}}> </div>
        }
      </div>
    )
  }
}

export default Brands;