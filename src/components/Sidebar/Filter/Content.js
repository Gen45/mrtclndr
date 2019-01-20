import React, {Component} from 'react';

import Button from './Button';

import {isValid} from '../../../helpers/misc';

class Content extends Component {

  render() {

    const filterCategories = this.props.filterCategories
      ? this.props.filterCategories
      : [];

    return (<div className={`content${this.props.inner
        ? '-inner'
        : ''}`}>
      {
        Object.keys(this.props.filters ? this.props.filters : {}).filter(r => this.props.filters[r]["count"] > 0 ).map((r, i) => {

          const filter = this.props.filters[r]["id"];
          const filterName = this.props.filters[r]["name"];
          const filterIcon = this.props.filters[r]["icon"] || false;
          const filterImage = this.props.filters[r]["image"] || false;
          const active = this.props.filtersList[this.props.filterName].items ? this.props.filtersList[this.props.filterName].items[r]['active'] : true; //this.props.filters[r]['active'];  
          const color = this.props.filters[r]["color"] || false;
          const labelDot = this.props.labelDot;
          const keyPhrase = isValid(this.props.keyPhrase)
            ? this.props.keyPhrase.toUpperCase()
            : '';
          const validKeyPhrase = this.props.filters[r]["name"].toUpperCase().indexOf(keyPhrase) > -1;
          
          return ((filterCategories.indexOf(Number(r)) > -1 && validKeyPhrase) || filterCategories.length === 0)
            ? <Button 
                key={this.props.filters[r]["id"]} 
                prefix="filter" 
                filter={filter} 
                filterName={filterName} 
                active={active} 
                handleChange={this.props.handleChange} 
                color={color} 
                filterIcon={filterIcon} 
                filterImage={filterImage} 
                labelDot={labelDot} 
                TooltipTheme={this.props.TooltipTheme} 
                tooltips={this.props.tooltips}
                count={this.props.filters[r]["count"]}
              />
            : null;
        })
      }
    </div>)
  }
}

export default Content;
