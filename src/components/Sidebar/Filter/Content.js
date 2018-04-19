import React, {Component} from 'react';

import Button from './Button';

class Content extends Component {

  render() {

    const filterCategories = this.props.filterCategories
      ? this.props.filterCategories
      : [];

    return (<div className={`content${this.props.inner
        ? '-inner'
        : ''}`}>
      {
        Object.keys(this.props.filters).map((r, i) => {

          const filter = r.toUpperCase();
          const filterName = this.props.filterInfo[r]["name"].toUpperCase();
          const filterIcon = this.props.filterInfo[r]["icon"] || false;
          const filterImage = this.props.filterInfo[r]["image"] || false;
          const active = this.props.filters[r];
          const color = this.props.filterInfo[r]["color"] || false;
          const labelDot = this.props.labelDot;
          const keyPhrase = this.props.keyPhrase !== "" && this.props.keyPhrase !== undefined
            ? this.props.keyPhrase.toUpperCase()
            : '';
          const validKeyPhrase = this.props.filterInfo[r]["name"].toUpperCase().indexOf(keyPhrase) > -1;

          // console.log(filterCategories, this.props.filterInfo[r]["name"], keyPhrase, validKeyPhrase);

          return ((filterCategories.indexOf(r) > -1 && validKeyPhrase) || filterCategories.length === 0)
            ? <Button key={i} prefix="filter" filter={filter} filterName={filterName} active={active} handleChange={this.props.handleChange} color={color} filterIcon={filterIcon} filterImage={filterImage} labelDot={labelDot}/>
            : null;
        })
      }
    </div>)
  }
}

export default Content;
