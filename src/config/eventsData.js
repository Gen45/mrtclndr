import events from './events.json';
import offers from './offers.json';
// import channels from './channels.json';
// import regions from './regions.json';
// import brands from './brands.json';
// import {year} from './defaultState';

import {getExtreme, isMultidate} from '../helpers/dates';

const getOffer = (offer, offers) => {
  const o = Object.keys(offers).filter(key => offers[key]["name"].toUpperCase() === offer.toUpperCase())[0];
  return o !== undefined && o !== "none"
    ? o
    : 'NO-PROMOTION';
}

const cleanChannels = channels => Object.keys(channels).filter(c => channels[c] !== null );

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
      region: e["Owner SubRegion"],
      brands: e["Brand"].split(','),
      campaignName: e["Campaign Name"],
      description: e["Description"],
      campaignGroup: e["Campaign Group"],
      segment: e["Segment"],
      market: e["Entire US"],
      programType: e["Program Type"],
      offer: getOffer(e["Offer"], offers),
      channels: cleanChannels(eventChannels),
      otherChannels: e["Other Channels"],
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
      earlierDay: getExtreme([e["Sell Start Date"], e["Stay Start Date"]], 'left'),
      latestDay: getExtreme([e["Sell End Date"], e["Stay End Date"]], 'right')
    };

    event['datesType'] = isMultidate(event.dates) ? 'MULTIDATE' : 'SINGLEDATE';

    return event;
  });
}

export default eventsData;
