import axios from 'axios';

import find from 'lodash/find';

import events from './events.json';
import offers from './offers.json';

import {
  getExtreme,
  isMultidate
} from '../helpers/dates';

const WP_URL = 'http://admin.marriottcalendar.com/wp-json/wp/v2/';
const parameters = '/?per_page=100';

export async function go() {
  try {

    let entries = [];

    const channelPromise = axios(`${WP_URL}channel${parameters}`);
    const brandPromise = axios(`${WP_URL}brand${parameters}`);
    const offerPromise = axios(`${WP_URL}offer${parameters}`);
    const regionPromise = axios(`${WP_URL}region${parameters}`);
    const ownerPromise = axios(`${WP_URL}owner${parameters}`); // disable
    const campaign_groupPromise = axios(`${WP_URL}campaign_group${parameters}`); // disable
    const segmentPromise = axios(`${WP_URL}segment${parameters}`); // disable
    const market_scopePromise = axios(`${WP_URL}market_scope${parameters}`); // disable
    const featured_markets1Promise = axios(`${WP_URL}featured_markets${parameters}&page=1`); // disable
    const featured_markets2Promise = axios(`${WP_URL}featured_markets${parameters}&page=2`); // disable
    const program_typePromise = axios(`${WP_URL}program_type${parameters}`); // disable
    const entry1Promise = axios(`${WP_URL}entry${parameters}&page=1`);
    const entry2Promise = axios(`${WP_URL}entry${parameters}&page=2`);
    const entry3Promise = axios(`${WP_URL}entry${parameters}&page=3`);
    const entry4Promise = axios(`${WP_URL}entry${parameters}&page=4`);
    const entry5Promise = axios(`${WP_URL}entry${parameters}&page=5`);



    const [
      channel,
      brand,
      offer,
      region,
      owner, // disable
      campaign_group, // disable
      segment, // disable
      market_scope, // disable
      featured_markets1, // disable
      featured_markets2, // disable
      program_type, // disable
      entry1,
      entry2,
      entry3,
      entry4,
      entry5
    ] =
    await Promise.all(
      [ channelPromise,
        brandPromise,
        offerPromise,
        regionPromise,
        ownerPromise, // disable
        campaign_groupPromise, // disable
        segmentPromise, // disable
        market_scopePromise, // disable
        featured_markets1Promise, // disable
        featured_markets2Promise, // disable
        program_typePromise, // disable
        entry1Promise,
        entry2Promise,
        entry3Promise,
        entry4Promise,
        entry5Promise
      ]);

    console.log(
    //    channel.data,
      //  brand.data,
    //    offer.data,
      //  region.data,
    //    owner.data, // disable
    //    campaign_group.data, // disable
    //    segment.data, // disable
    //    market_scope.data, // disable
      //  featured_markets.data, // disable
      //  program_type.data, // disable
    //    entry.data
       );

    const featured_marketsALL = [...featured_markets1.data, ...featured_markets2.data];
    const entriesALL = [...entry1.data,...entry2.data,...entry3.data,...entry4.data,...entry5.data,];
    // console.log(featured_marketsALL);
       
    entries = entriesALL.map(e => {
      let _region = find(region.data, r => r.id === e.region[0]);
      // console.log(e.id);
      return {
        id: e.id,
        region: [_region.name],
        // region: {id: _region.id, name: _region.name, slug: _region.slug, color: _region.acf.color},
        brands:  e.brand.map( b => find(brand.data, i => i.id === b ).acf.abreviation ),
        channels:  e.channel.map( c => find(channel.data, i => i.id === c ).slug ),
        campaignName:  e.title.rendered,
        dates: e.acf.dates,
        description: e.acf.description,
        owner: e.owner[0] ? { name: find(owner.data, o => o.id === e.owner[0]).name } : {},
        campaignGroup: find(campaign_group.data, cg => cg.id === e.acf.campaign_group).name,
        segment: e.segment[0] ? find(segment.data, s => s.id === e.segment[0]).name : null,
        market: e.featured_markets[0] ? find(featured_marketsALL, fm => fm.id === e.featured_markets[0]).name : null, 
        programType: e.program_type[0] ? find(program_type.data, pt => pt.id === e.program_type[0]).name : null,
        offer: e.offer[0] ? find(offer.data, o => o.id === e.offer[0]).name : null,
        otherChannels: e.acf.other_channels,
        ongoing: e.acf.dates.ongoing,
        datesType: e.acf.dates.multidate ? 'MULTIDATE' : 'SINGLEDATE',
        dates: {
          sell: {
            start: e.acf.dates.sell.start,
            end: e.acf.dates.sell.end
          },
          stay: {
            start: e.acf.dates.stay.start,
            end: e.acf.dates.stay.end
          }
        },
        earliestDay: getExtreme([e.acf.dates.sell.start, e.acf.dates.stay.start], 'left'),
        latestDay: getExtreme([e.acf.dates.sell.end, e.acf.dates.stay.end], 'right')
      }
    });

    console.log(entriesALL[0], entries);

  } catch (e) {
    console.error(e);
  }
}

go();

const getOffer = (offer, offers) => {
  const o = Object.keys(offers).filter(key => offers[key]["name"].toUpperCase() === offer.toUpperCase())[0];
  return o !== undefined && o !== "none" ?
    o :
    'NO-PROMOTION';
}

const cleanChannels = channels => Object.keys(channels).filter(c => channels[c] !== null && channels[c] !== '' && channels[c] !== undefined);
const getMarket = (e) => `${e["Destination - Featured Market"].replace("Other - please list in column G",'')} ${e["Market - more"]}`;


const eventsData = () => {

  // go();

  return events.map(e => {

    const eventChannels = {
      "EVENTS": e["Events"],
      "MEDIA": e["Media"],
      "CONTENT": e["Content"],
      "DIRECT_MAIL": e["Direct Mail"],
      "EMAIL": e["Email"],
      "ON_PROPERTY": e["On Property"],
      "BRAND_COM": e["Brand-dot-Com"],
      "PR": e["PR"],
      "SOCIAL": e["Social"],
      "OTHER_CHANNELS": e["Other Channels"],
    };

    let event = {
      id: e["Id"],
      region: [e["Owner SubRegion"]],
      brands: e["Brand"].split(','),
      campaignName: e["Campaign Name"],
      description: e["Description"],
      campaignGroup: e["Campaign Group"],
      segment: e["Segment"],
      market: getMarket(e),
      programType: e["Program Type"],
      offer: [getOffer(e["Offer"], offers)],
      channels: cleanChannels(eventChannels),
      otherChannels: e["Other Channels"],
      ongoing: e["Ongoing Campaign"],
      owner: {
        name: e["Owner"]
      },
      dates: {
        sell: {
          start: e["Sell Start Date"],
          end: e["Sell End Date"]
        },
        stay: {
          start: e["Stay Start Date"],
          end: e["Stay End Date"]
        }
      },
      earliestDay: getExtreme([e["Sell Start Date"], e["Stay Start Date"]], 'left'),
      latestDay: getExtreme([e["Sell End Date"], e["Stay End Date"]], 'right')
    };

    event['datesType'] = isMultidate(event.dates) ? 'MULTIDATE' : 'SINGLEDATE';

    return event;
  });
}

export default eventsData;