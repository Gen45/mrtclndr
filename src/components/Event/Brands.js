import React, {Component} from 'react';

const Brand = (props) => {
  return (
    <span className={`brand ${props.brandsInfo[props.brand]["slug"]}${props.editable ? ' editable-field' : ''}${props.selected ? ' selected' : ''} `} title={props.brandsInfo[props.brand]["name"]} 
      onClick={(e) => props.toggleBrand(props.brand, props.event, props.editable)}>
      <img src={props.brandsInfo[props.brand]["image"]} alt={props.brandsInfo[props.brand]["name"]} />
    </span>
  )
}

const Preset = (props) => {
  return (
    <span className="brand preset editable-field" onClick={(e) => props.handlePreset(props.brand, props.event)} >{props.brandGroups[props.brand].name}</span>
  )
}

class Brands extends Component {

  toggleBrand = (id, event, editable) => {
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

  handlePreset = (id, event) => {
    console.log(event.brands);
    event.brands.length = 0;
    event.brands.push(...this.props.brandGroups[id].brands);
    console.log(event.brands);
    this.setState({ change: true });
  }

  render() {
    const brands = this.props.brands;

    // console.log(this.props.brandGroups);

    return (
      <div className="brands">

        {
          this.props.editingBrands &&
          <div style={{display: 'block', width: '100%', margin: '10px 0', textAlign:'center', color: '#FFFFFF'}}> Presets </div>
        }
        {
          this.props.editingBrands &&
          Object.keys(this.props.brandGroups).map((b, i) => 
            <Preset 
              key={i} 
              brand={this.props.brandGroups[b].id}
              handlePreset={this.handlePreset}
              event={this.props.event}
              brandGroups={this.props.brandGroups}
            />
          )
       }
        {
          this.props.editingBrands &&
          <div style={{display: 'block', width: '100%', margin: '20px 0 10px', textAlign:'center', color: '#FFFFFF'}}> Click on a Brand to Select it </div>
        }  
        {
          this.props.editingBrands &&
          Object.keys(this.props.brandGroups).filter(b => !this.props.brandGroups[b].preset).map((bg, i) => 
            
            this.props.brandGroups[bg].brands.filter(b => this.props.brandsInfo[b].slug !== 'no-brand').map((b, i) =>
              <Brand key={i} brand={this.props.brandsInfo[b].id} brandsInfo={this.props.brandsInfo} editable={this.props.editable} event={this.props.event} toggleBrand={this.toggleBrand} 
              selected={brands.indexOf(this.props.brandsInfo[b].id) > -1} />
            )
          )

        }
        {
          !this.props.editingBrands &&
          brands.map((b, i) => { return this.props.brandsInfo[b].slug !== 'no-brand' && 
            <Brand key={i} brand={b} brandsInfo={this.props.brandsInfo} editable={this.props.editingBrands} event={this.props.event} toggleBrand={this.toggleBrand} />
          })
        }
        {
          this.props.editingBrands &&
          <div style={{display: 'block', width: '100%', margin: '10px 0', textAlign:'center', color: '#FFFFFF'}}> </div>
        }
        {
          this.props.editable && !this.props.editingBrands &&
          <div style={{ display: 'block', width: '100%', margin: '0px 0', textAlign: 'center', color: '#FFFFFF' }}>
            <span className=" add-brand editable-field" title="add brand" onClick={() => { this.props.editBrands(true) }} > <i className="nc-icon-mini ui-1_pencil" style={{ marginLeft: 10 }}></i> Edit Brands </span>
          </div>
        }
      </div>
    )
  }
}

export default Brands;