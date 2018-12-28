import React, {Component} from 'react';
import {Tooltip} from 'react-tippy';
import TextareaAutosize from 'react-autosize-textarea';
import Select from 'react-select';

import Header from './Header';
import Brands from './Brands';
import Dates from './Dates';
import Timelines from './Timelines';

import {isMultidate, getExtreme, today} from '../../helpers/dates';
import {isValid} from '../../helpers/misc';

import {_COLORS} from '../../config/constants';

const removeSearched = (str) => {
  return str
    .replace(/<b class="searched">/g, '')
    .replace(/<\/b>/g, '');
}

class Event extends Component {

  componentWillMount() {
    this.setState({ addingBrands: false, addingChannels: false });
  }

  handleOpenModal = (targetId) => {
    !this.props.elevated && this.props.handleOpenModal(targetId);
  };

  keepEdits = (value, field) => {
    // console.log(value, field, this.props.event[field]);
    this.props.event[field] = value;
    this.setState({changed: true });
  }
  
  cleanFilterInfo = (filterInfo) => {
    // console.log(filterInfo);
    return Object.keys(filterInfo).map( x => { return {label: filterInfo[x].name, value: filterInfo[x].id} } );
  }

  render() {

    const event = this.props.event;
    
    // console.log(event);

    const regionColor = this.props.event['region'][0].color;
    const offerColor = this.props.event['offer'][0].color;
    
    const ownerName = this.props.event['owner'][0].name;
    const offerName = this.props.event['offer'][0].name || 'No offer especified';
    const time = this.props.time;
    const multidate = isMultidate(event.dates);
    const isPastEvent = event.latestDay < getExtreme([today()],'right');
    const eventClassName = `event${multidate ? ' MULTIDATE' : ''}${this.props.isModal ? ' grid-view' : ''}${isPastEvent ? ' PAST-EVENT' : ''}`;

    const isHighLighted = () => this.props.modalEventId === event.id;
    const HighLightedStyle = {boxShadow: '0 0 1px 5px rgba(160,160,160, 0.75)'};

    const tooltip_styles = { width: 250, fontSize: 14, textAlign: 'left' };
    // console.log(event);

    return (
      <div className={eventClassName} onClick={() => {
        this.handleOpenModal(event['id']);}}
        style={isHighLighted() ? HighLightedStyle : {}}
      >
        <div className='event-inner'>
        {
          this.props.view === 'grid' && !this.props.editingBrands &&
            <Header 
              channels={event.channels} 
              otherChannels={event.otherChannels} 
              color={this.props.editable ? _COLORS.MEDIUMGRAY : regionColor} 
              editable={this.props.editable} 
              editChannels={this.props.editChannels} 
              editingChannels={this.props.editingChannels} 
              channelsInfo={this.props.channelsInfo}
              event={this.props.event}
            />
        }
        {
        !this.props.editingBrands && !this.props.editingChannels &&
        <div className={`event-info`}>
        {
          this.props.view === 'grid' && 
          <Dates dates={event.dates} editable={this.props.editable} event={this.props.event}/>        
        }

          <div className='info-wrapper'>
            <div className='activity'>
              {
                this.props.editable 
                ? <TextareaAutosize className="editable-field"  defaultValue={removeSearched(event.campaign_name)} onChange={(e) => this.keepEdits(e.target.value, 'campaign_name')} />
                : <span> 
                    {
                    this.props.view === 'timeline' && 
                      <span className='label-dot' style={{ backgroundColor: offerColor, marginRight: '10px' }} /> 
                    }
                    <span dangerouslySetInnerHTML={{ __html: event.campaign_name }} />
                  </span>
              }
            </div>

          {
            this.props.view === 'grid' && !this.props.editable && 
            <div>
              <p className='tags'>
                <span className="tag"> 
                  <span style={{ color: _COLORS.LIGHTGRAY }}>Offer: </span>
                  {offerName} 
                  <span className='label-dot' style={{ backgroundColor: offerColor, marginLeft: '5px' }} /> 
                </span>
              </p>

              <p className='tags'>
                {
                      [
                        { name: "Region", val: event.region[0].name },
                        { name: "Featured Market", val: event.featured_market[0].name },
                        { name: "Market Scope", val: event.market_scope[0].name },
                        { name: "Campaign Group", val: event.campaign_group[0].name }, 
                        { name: "Program Type", val: event.program_type[0].name }, 
                        { name: "Segment", val: event.segment[0].name },
                        { name: "Ongoing", val: event.ongoing ? 'Yes' : 'No' },
                      ].map((e, i)=> isValid(e.val) ?
                    <span key={i} className='tag'>
                      <span style={{color: _COLORS.LIGHTGRAY }}>{e.name}: </span> {e.val}
                    </span>
                  : null
                  )
                }
              </p>
            </div>
          }
          {
            this.props.view === 'grid' && this.props.editable && 
            <div>
              <div className='tags'>
                <Tooltip key={'offer-key'} delay={0} arrow={true} distance={10} theme="light" size="big" trigger="click" interactive html={(
                  <div key={'offer-key'} style={tooltip_styles}>
                    <Select key={'offer-key'} placeholder={offerName} options={this.cleanFilterInfo(this.props.offers)} onChange={opt => this.keepEdits([this.props.offers[opt.value]], 'offer')} /></div> )} >
                  <span className="tag editable-field" tabIndex={0}> 
                    <span style={{ color: _COLORS.LIGHTGRAY }}>Offer: </span>
                    {offerName} 
                    <span className='label-dot' style={{ backgroundColor: offerColor, marginLeft: '5px' }} /> 
                  </span>
                </Tooltip>
              </div>
              <div className='tags'>
                {
                  [
                    { field:'region', name: "Region", val: event.region[0].name, options: this.cleanFilterInfo(this.props.regions)},
                    { field:'featured_market', name: "Featured Market", val: event.featured_market[0].name, options: this.cleanFilterInfo(this.props.featured_markets), isSearchable: true },
                    { field:'market_scope', name: "Market Scope", val: event.market_scope[0].name, options: this.cleanFilterInfo(this.props.market_scopes)},
                    { field:'campaign_group', name: "Campaign Group", val: event.campaign_group[0].name, options: this.cleanFilterInfo(this.props.campaign_groups)}, 
                    { field:'program_type', name: "Program Type", val: event.program_type[0].name, options: this.cleanFilterInfo(this.props.program_types)}, 
                    { field:'segment', name: "Segment", val: event.segment[0].name, options: this.cleanFilterInfo(this.props.segments)}
                  ].map((e, i)=> isValid(e.val) 
                  ?
                    <Tooltip key={i} title={e.name} delay={0} arrow={true} distance={10} theme="light" size="big" trigger="click" interactive
                          html={(
                            <div style={tooltip_styles}>
                              <Select 
                                placeholder={e.field !== 'ongoing' ? event[e.field][0].name : event.ongoing ? 'Yes' : 'No' } 
                                options={e.options} 
                                onChange={opt => this.keepEdits([this.props[e.field + 's'][opt.value]], e.field)} 
                              />
                            </div> )} isSearchable={e.isSearchable} >
                      <span className="tag editable-field" tabIndex={0}> 
                        <span style={{color: _COLORS.LIGHTGRAY }}>{e.name}: </span> {e.val}
                      </span>
                    </Tooltip>
                  : null
                  )
                }
                    <span className="tag editable-field" tabIndex={0} onClick={(e) => this.keepEdits(!event.ongoing, 'ongoing')}> 
                  <span style={{ color: _COLORS.LIGHTGRAY }}>Ongoing: </span> {event.ongoing ? 'Yes' : 'No'}
                </span>
              </div>
            </div>            
          }          

          {
            this.props.elevated && this.props.view === 'grid' && !this.props.editingBrands && !this.props.editingChannels &&
            <div>
            {
              this.props.editable 
              ? <p className='description'><TextareaAutosize className="editable-field" defaultValue={removeSearched(event.description)} onChange={(e) => this.keepEdits(e.target.value, 'description')} /> </p>
              : <p className='description' dangerouslySetInnerHTML={{ __html: event.description }} />
            }
            </div>
          }
          </div>
        
        {
          this.props.view === 'grid' &&
          <i className='more'/>
        }
        </div>
      }

      {
        this.props.elevated && this.props.view === 'grid' &&
        <div className='tabs'>
          <div className={`tab-content t1 ${this.props.elevated
              ? ' active'
              : ''}`}>

              {
                  !this.props.editingBrands && !this.props.editingChannels &&
                  <div>
                    { 
                      !this.props.editable
                        ? <p className='contact ' title={ownerName}><i className='nc-icon-mini users_circle-09' style={{ color: regionColor }} /> {ownerName}</p>
                        : <Tooltip key={'owner-key'} delay={0} arrow={true} distance={10} theme="light" size="big" trigger="click" interactive
                            html={(
                              <div key={'owner-key'} style={tooltip_styles}>
                                <Select key={'owner-key'} options={this.cleanFilterInfo(this.props.owners)} onChange={opt => this.keepEdits([this.props.owners[opt.value]], 'owner')} /> 
                              </div> 
                            )} 
                          >
                          <p tabIndex={0} className='editable-field contact ' title={ownerName}>
                            <i className='nc-icon-mini users_circle-09' style={{ color: _COLORS.LIGHTGRAY }} /> {ownerName}
                          </p>
                        </Tooltip>
                    }
                  </div>
              }
              {
                !this.props.editingChannels &&
                  <Brands 
                    brands={event.brands} 
                    brandsInfo={this.props.brandsInfo} 
                    editable={this.props.editable}
                    event={event} 
                    editBrands={this.props.editBrands} 
                    editingBrands={this.props.editingBrands} 
                  />
              }
          </div>
        </div>
      }

      </div>

    {
      this.props.view === 'timeline' &&
      <Timelines dates={event.dates} color={regionColor} Y={time.Y} datesType={event.datesType} time={this.props.time} />
    }

    </div>)
  }
}

export default Event;
