import React, {Component} from 'react';
import {Tooltip} from 'react-tippy';
import TextareaAutosize from 'react-autosize-textarea';
import { Scrollbars } from 'react-custom-scrollbars';
import Select from 'react-select';
// import stringSimilarity from 'string-similarity';
import stringSimilarity from '../../helpers/compareStrings';
import TimeAgo from 'react-timeago'
import orderBy from 'lodash/orderBy';

import Header from './Header';
import Brands from './Brands';
import Dates from './Dates';
import Timelines from './Timelines';

import { isMultidate, getExtreme, today, compareDates, dateTime} from '../../helpers/dates';
import { isValid, removeSearched, urlify} from '../../helpers/misc';

import { _COLORS } from '../../config/constants';

class Event extends Component {

  componentWillMount() {
    this.setState({ addingBrands: false, addingChannels: false, similar: [] });
    if (this.props.isModal) {
      this.checkSimilarities();
    }
  }

  handleOpenModal = (targetId, similar) => {
    (!this.props.elevated || similar) && this.props.handleOpenModal(targetId);
  };

  keepEdits = (value, field) => {
    // console.log(this.props.event);
    if (field === 'campaign_name') {
      this.checkSimilarities();
    }
    this.props.event[field] = value;
    this.setState({changed: true});
  }
  
  cleanFilterInfo = (filterInfo) => {
    // console.log(filterInfo);
    return Object.keys(filterInfo).map( x => { return {label: filterInfo[x].name, value: filterInfo[x].id} } );
  }
  
  checkSimilarities = () => {
    let similarCampaignNames = this.props.events.filter(e => stringSimilarity.compareTwoStrings(this.props.event.campaign_name.toLowerCase(), e.campaign_name.toLowerCase()) > 0.8 && e.id !== this.props.event.id );
    // console.log(similarCampaignNames);
    this.setState({ similar: similarCampaignNames });
  }

  render() {

    const event = this.props.event;
   
    // console.log(event);

    const regionColor = this.props.event['region'][0].color;
    // console.log(this.props.event['offer']);
    // const offerColor = this.props.event['offer'][0].color;
    // console.log(this.props.event['offer']);
    const offerColors = this.props.event['offer'].filter(x => x !== undefined).map(x => x.color);
    
    // const this.props.event['owner'][0].name = this.props.event['owner'][0].name;
    // const offerName = this.props.event['offer'][0].name || 'No offer especified';
    const offerNames = this.props.event['offer'].filter(x => x !== undefined).map(x => x.name || 'No offer especified');
    const time = this.props.time;
    const multidate = isMultidate(event.dates);
    const isPastEvent = event.latestDay < getExtreme([today()],'right');
    const eventClassName = `event${multidate ? ' MULTIDATE' : ''}${this.props.isModal ? ' grid-view' : ''}${isPastEvent ? ' PAST-EVENT' : ''}`;

    // console.log(offerColors, offerNames);
    // console.log(event.program_type[0]);

    const isHighLighted = () => this.props.modalEventId === event.id;
    const HighLightedStyle = {boxShadow: '0 0 1px 5px rgba(160,160,160, 0.75)'};

    const tooltip_styles = { width: 250, fontSize: 14, textAlign: 'left' };

    
    const getFeaturedMarkets = (featured_markets, editable) => {
      return featured_markets.reduceRight((a, i) => {
        return i === undefined 
          ? a : `${i.name === 'None' ? '' : i.name}${a === '' ? '' : (i.name === 'None' ? '' : '; ') + a}`
      }, editable ? '' : event.market_more);
    }

    const getMarketScopes = (market_scope) => {
      return market_scope.reduceRight((a, i) => {
        return i === undefined
          ? a : `${i.name === 'None' ? '' : i.name}${a === '' ? '' : (i.name === 'None' ? '' : '; ') + a}`
      }, '');
    }

    const getOffers = (offer) => {
      return offer.reduceRight((a, i) => {
        return i === undefined
          ? a : `${i.name === 'None' ? '' : i.name}${a === '' ? '' : (i.name === 'None' ? '' : '; ') + a}`
      }, '');
    }

    // console.log(event);

    return (
      <div className={eventClassName} onClick={() => {
        this.handleOpenModal(event['id'])}}
        style={isHighLighted() ? HighLightedStyle : {}}
      >
        <div className='event-inner'>
          {
            this.state.similar.length > 0 && !this.props.editable &&
            <div className='warning'>
              {
                <span className="pretext">
                  {`${this.state.similar.length} similar entr${this.state.similar.length > 1 ? 'ies' : 'y'} found: `}
                </span>
              }
              {
                this.state.similar.map((s, i) =>
                  <span className="similar-entry" key={i}
                    onClick={() => {
                      this.handleOpenModal(s['id'], true)
                    }}>

                    {`${removeSearched(s.campaign_name)}`}
                  </span>
                )
              }
            </div>
          }

          {
            !compareDates(this.props.event.dates.stay.end, this.props.event.dates.stay.start) && this.props.view !== 'timeline' && 
            <div className='warning'>
              {
                <span className="pretext">
                  Problem with date: STAY END DATE CANNOT BE EARLIER THAN STAY START DATE
                </span>
              }
            </div>
          }

          {
            !compareDates(this.props.event.dates.sell.end, this.props.event.dates.sell.start) && this.props.view !== 'timeline' && 
            <div className='warning'>
              {
                <span className="pretext">
                  Problem with date: SELL END DATE CANNOT BE EARLIER THAN SELL START DATE
                </span>
              }
            </div>
          }

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
              keepEdits={this.keepEdits}
              starred={this.props.isStarred(event.id)}
              isModal={this.props.isModal}
            />
        }
        {
        !this.props.editingBrands && !this.props.editingChannels &&
        <div className={`event-info`}>
        {
          this.props.view === 'grid' && 
          <Dates dates={event.dates} editable={this.props.editable} event={this.props.event} />
        }

          <div className='info-wrapper'>
            <div className='activity'>
              {
                this.props.editable 
                      ? <TextareaAutosize ref={input => this.campaign_name = input} className="editable-field" placeholder="Campaign Name" defaultValue={removeSearched(event.campaign_name)} 
                    onChange={(e) => this.keepEdits(e.target.value, 'campaign_name')} />
                : <span> 
                    {
                    this.props.view === 'timeline' && 
                      offerColors.map( (x, i) => 
                        <span key={i} className='label-dot' style={{ backgroundColor: x, marginRight: '10px' }} /> 
                      )
                    }
                    <span dangerouslySetInnerHTML={{ __html: event.campaign_name }} />
                  </span>
              }
            </div>
          {
            this.props.view === 'grid' && !this.props.editable &&
            <div>

              <p className='tags'>
                {
                  this.props.event['offer'].map( (x, i) => 
                    <span key={i} className="tag"> 
                      <span style={{ color: _COLORS.LIGHTGRAY }}>{this.props.cala ? "Initiative:" : "Offer:"} </span>
                      <u dangerouslySetInnerHTML={{ __html: offerNames[i] }} />
                      <span className='label-dot' style={{ backgroundColor: offerColors[i], marginLeft: '5px' }} />  
                    </span>
                  )
                }
              </p>

              <p className='tags'>
                {
                      [
                        { name: "Region", val: event.region[0].name },
                        { name: "Market Scope", val: getMarketScopes(event.market_scope) },
                        { name: "Featured Markets", val: getFeaturedMarkets(event.featured_market) },
                        { name: "Program Type", val: event.program_type[0].name }, 
                        { name: "Campaign Group", val: event.campaign_group[0].name }, 
                        { name: "Segment", val: event.segment[0].name },
                        { name: "Ongoing", val: event.ongoing ? 'Yes' : 'No' },
                      ]
                      .filter(x => !(event.region[0].name === 'CALA' && x.name === "Program Type") )
                      .map((e, i) => isValid(e.val) && e.val !== `No ${e.name}` 
                  ?
                    <span key={i} className='tag'>
                      <span style={{color: _COLORS.LIGHTGRAY }}>{e.name}: </span> <u dangerouslySetInnerHTML={{ __html: e.val }} />
                    </span>
                  : null
                  )
                }
              </p>
              <p className='tags'>
                {
                  isValid(event.landing_page_url) &&
                  <span className='tag'>
                    <span style={{ color: _COLORS.LIGHTGRAY }}>Landing Page URL: </span> <u dangerouslySetInnerHTML={{ __html: urlify(event.landing_page_url) }} />
                  </span>
                }
                {
                  isValid(event.creative_url) &&
                  <span className='tag'>
                    <span style={{ color: _COLORS.LIGHTGRAY }}>Creative URL: </span> <u dangerouslySetInnerHTML={{ __html: urlify(event.creative_url) }} />
                  </span>
                }
                
              </p>
            </div>
          }
          {
            this.props.view === 'grid' && this.props.editable && 
            <div>

              <div className='tags'>
                {
                  [
                    { field: 'region', name: "Region", val: event.region[0].name, options: this.cleanFilterInfo(this.props.regions)},
                    {
                      field: 'offer', name: "Offer", val: getOffers(event.offer), options: orderBy( this.cleanFilterInfo(this.props.offers), 'label'), isSearchable: true, isMulti: true
                    },
                    {
                      field: 'market_scope', name: "Market Scope", val: getMarketScopes(event.market_scope), options: orderBy(
                        this.cleanFilterInfo(this.props.market_scopes).filter(x => {
                          const result = this.props.market_scopes[x.value].regions.indexOf(event.region[0].id) >= 0;
                          return result
                        }
                        )
                        , 'label'), isSearchable: true, isMulti: true
                    },
                    { 
                      field: 'featured_market', name: "Featured Market", val: getFeaturedMarkets(event.featured_market, true), options: orderBy( 
                        this.cleanFilterInfo(this.props.featured_markets).filter(x => 
                        {
                          const result = this.props.featured_markets[x.value].regions.indexOf(event.region[0].id) >= 0;
                          return result
                        }
                        )
                        , 'label'), isSearchable: true, isMulti: true
                    },
                    { field:'market_more', name: 'Other Markets', val: event.market_more },
                    { field:'program_type', name: "Program Type", val: event.program_type[0].name, options: this.cleanFilterInfo(this.props.program_types)}, 
                    { field:'campaign_group', name: "Campaign Group", val: event.campaign_group[0].name, options: this.cleanFilterInfo(this.props.campaign_groups)}, 
                    { field:'segment', name: "Segment", val: event.segment[0].name, options: this.cleanFilterInfo(this.props.segments)},
                  ]
                  //.filter(x => !(event.region[0].name === 'CALA' && x.field === "program_type" ))
                  .map((e, i) => true
                  ?
                    e.field !== 'market_more'
                    ?
                      <Tooltip key={i} title={e.name} delay={0} arrow={true} distance={10} theme="light" size="big" trigger="click" interactive
                        disabled={(event.region[0].name === 'CALA' && e.field === "program_type")}
                        unmountHTMLWhenHide={true}
                        html={(
                            <div style={e.isMulti === true ? { ...tooltip_styles, width: 388 } : tooltip_styles }>
                              <Select
                                defaultValue={
                                  e.isMulti && event[e.field] === undefined
                                  ? 
                                    {} 
                                  :
                                  event[e.field].map(x => {
                                    return x !== undefined 
                                      ? { label: removeSearched(x.name), value: x.id } 
                                      : {} }) 
                                  }
                                options={e.options}
                                onChange={opt => {
                                  if (e.isMulti === true) {
                                    this.keepEdits(opt.map(x => this.props[e.field + 's'][x.value]), e.field);
                                  } else {
                                    this.keepEdits([this.props[e.field + 's'][opt.value]], e.field);
                                  }
                                  }
                                } 
                                isSearchable={e.isSearchable !== undefined ? true : false} 
                                closeMenuOnSelect={!e.isMulti}
                                isMulti={e.isMulti !== undefined ? true : false} />
                            </div>
                          )} >
                          {
                            !(event.region[0].name === 'CALA' && e.field === "program_type") 
                            ?
                              <span className={`tag editable-field ${e.field}`} tabIndex={0}>
                                <span className="field" style={{ color: _COLORS.LIGHTGRAY }}>{e.name}: </span> {removeSearched(e.val)}
                              </span>
                            : 
                              <div />
                          }
                      </Tooltip>
                    :
                      <Tooltip key={i} title={e.name} delay={0} arrow={true} distance={10} theme="light" size="big" trigger="click" interactive
                        html={(
                            <TextareaAutosize autoFocus className="editable-field" tabIndex={0} placeholder={e.name} defaultValue={removeSearched(event.market_more)}
                              onChange={(ev) => this.keepEdits(ev.target.value, e.field)} style={{width:300}} />
                          )} >
                        <span className="tag editable-field" tabIndex={0}>
                          <span style={{ color: _COLORS.LIGHTGRAY }}>{e.name}: </span> {removeSearched(e.val)}
                        </span>
                      </Tooltip>
                  : null
                  )
                }
                <span className="tag editable-field" tabIndex={0} onClick={(e) => this.keepEdits(!event.ongoing, 'ongoing')}> 
                  <span style={{ color: _COLORS.LIGHTGRAY }}>Ongoing: </span> {event.ongoing ? 'Yes' : 'No'}
                </span>
              </div>


              <div className="tags">
                <Tooltip  title="Landing Page URL" delay={0} arrow={true} distance={10} theme="light" size="big" trigger="click" interactive
                  html={(<TextareaAutosize autoFocus className="editable-field" tabIndex={0} placeholder="Landing Page URL" defaultValue={event.landing_page_url}
                    onChange={(ev) => this.keepEdits(ev.target.value, 'landing_page_url')} style={{width:300}} />
                    )} >
                  <span className="tag editable-field" tabIndex={0}>
                  <span style={{ color: _COLORS.LIGHTGRAY }}>Landing Page URL: </span> {event.landing_page_url}
                  </span>
                </Tooltip>
                
                <Tooltip  title="Creative URL" delay={0} arrow={true} distance={10} theme="light" size="big" trigger="click" interactive
                  html={(<TextareaAutosize autoFocus className="editable-field" tabIndex={0} placeholder="Creative URL" defaultValue={event.creative_url}
                    onChange={(ev) => this.keepEdits(ev.target.value, 'creative_url')} style={{width:300}} />
                    )} >
                  <span className="tag editable-field" tabIndex={0}>
                  <span style={{ color: _COLORS.LIGHTGRAY }}>Creative URL: </span> {event.creative_url}
                  </span>
                </Tooltip>
              </div>



            </div>            
          }          

          {
            this.props.elevated && this.props.view === 'grid' && !this.props.editingBrands && !this.props.editingChannels &&
            <div>
            {
              this.props.editable 
              ? 
                <p className='description'><TextareaAutosize rows={2} maxRows={4} className="editable-field" placeholder="Description" defaultValue={removeSearched(event.description).replace(/<br \/>/g, '')} onChange={(e) => this.keepEdits(e.target.value.replace(/<br \/>/g, ''), 'description')} /> </p>
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
        this.props.view === 'grid' &&
        <div className='tabs'>
          <div className={`tab-content t1 ${this.props.elevated
              ? ' active'
              : ''}`}>

              {
                !this.props.editingBrands && !this.props.editingChannels &&
                  <div>
                    { 
                      !this.props.editable
                        ? <p className='contact '><i className='nc-icon-mini users_circle-09' style={{ color: regionColor }} /> <span dangerouslySetInnerHTML={{ __html: this.props.event['owner'][0].name }} ></span></p>
                        : <Tooltip key={'owner-key'} delay={0} arrow={true} distance={10} theme="light" size="big" trigger="click" interactive
                            html={(
                              <div key={'owner-key'} style={tooltip_styles}>
                                <Select key={'owner-key'} 
                                  defaultValue={event['owner'].map(x => { return { label: x.name, value: x.id } })}
                                  options={this.cleanFilterInfo(this.props.owners)} onChange={opt => this.keepEdits([this.props.owners[opt.value]], 'owner')} /> 
                              </div> 
                            )} 
                          >
                          <p tabIndex={0} className='editable-field contact ' title={removeSearched(this.props.event['owner'][0].name)}>
                            <i className='nc-icon-mini users_circle-09' style={{ color: _COLORS.LIGHTGRAY }} /> {removeSearched(this.props.event['owner'][0].name)}
                          </p>
                        </Tooltip>
                    }
                  </div>
              }
              {
                this.props.elevated && event.activity_log !== undefined && event.activity_log.length > 0 && !this.props.editable && !this.props.cala &&
                <div className="activity-log">
                  <Scrollbars thumbMinSize={100} universal={true} autoHide={true} style={{
                      maxHeight: 150, height: 150
                  }}>
                  {
                    event.activity_log.filter(x=>x).reverse().map( (a, i) => 
                      <div key={i} className="activity">
                        {
                          a['activity'].message.length > 0 &&
                          <span className="message">" {a['activity'].message} "</span>
                        }
                        <span className="action">{a['activity'].action}</span>
                        <span>by</span>
                        <span className="name">{a['activity'].user.display_name !== undefined ? a['activity'].user.display_name : 'DELETED USER'}</span>
                        <span></span>
                        <span className="date">
                          <Tooltip 
                            title={`${dateTime(new Date(`${a['activity'].date} UTC`))}`}
                            trigger="mouseenter"
                            delay={200}
                            arrow={true}
                            distance={30}
                            theme="light"
                            size="big"
                            position="bottom"
                          >
                          <TimeAgo title="" date={`${a['activity'].date} UTC`}  />
                          </Tooltip>
                        </span>
                      </div>
                    )
                  }
                  </Scrollbars>
                </div>
              }
              {
                this.props.elevated && !this.props.editingChannels &&
                  <Brands 
                    brands={event.brands} 
                    brandsInfo={this.props.brandsInfo} 
                    editable={this.props.editable}
                    event={event} 
                    editBrands={this.props.editBrands} 
                    editingBrands={this.props.editingBrands} 
                    brandGroups={this.props.brandGroups}
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
