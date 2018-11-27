import axios from 'axios';
import events from './events.json';
import offers from './offers.json';

import {
  getExtreme,
  isMultidate
} from '../helpers/dates';

const WP_URL = 'http://admin.marriottcalendar.com/wp-json/wp/v2/';
const parameters = '/?per_page=100';

async function go() {
  try {

    const channelPromise = axios(`${WP_URL}channel${parameters}`);
    const brandPromise = axios(`${WP_URL}brand${parameters}`);
    const offerPromise = axios(`${WP_URL}offer${parameters}`);
    const regionPromise = axios(`${WP_URL}region${parameters}`);
    const ownerPromise = axios(`${WP_URL}owner${parameters}`);
    const campaign_groupPromise = axios(`${WP_URL}campaign_group${parameters}`);
    const segmentPromise = axios(`${WP_URL}segment${parameters}`);
    const market_scopePromise = axios(`${WP_URL}market_scope${parameters}`);
    const featured_marketsPromise = axios(`${WP_URL}featured_markets${parameters}`);
    const program_typePromise = axios(`${WP_URL}program_type${parameters}`);
    const entryPromise = axios(`${WP_URL}entry${parameters}`);

    const [channel, brand, offer, region, owner, campaign_group, segment, market_scope, featured_markets, program_type, entry] = await Promise.all([channelPromise, brandPromise, offerPromise, regionPromise, ownerPromise, campaign_groupPromise, segmentPromise, market_scopePromise, featured_marketsPromise, program_typePromise, entryPromise]);

    console.log(channel.data, brand.data, offer.data, region.data, owner.data, campaign_group.data, segment.data, market_scope.data, featured_markets.data, program_type.data, entry.data);


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