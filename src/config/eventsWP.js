import axios from 'axios';

import find from 'lodash/find';
import { today, month, year } from '../helpers/dates';

import {
  getExtreme, isMultidate
} from '../helpers/dates';

import { _CACHE } from '../config/constants';

import {
  decodeHTML
} from '../helpers/misc';

const WP_URL = 'http://admin.marriottcalendar.com/wp-json/wp/v2/';

const auth = () => {
  const token = localStorage.getItem(`auth-${today()}`);
  if (token) {
    return { 'Authorization': "Bearer " + token }; //JSON.parse(decodeURIComponent(escape(atob(auth))));
  }
}

export async function getMetaData() {
  try {

    const channelPromise = axios(`${WP_URL}channel/?per_page=100`);
    const brandPromise = axios(`${WP_URL}brand/?per_page=100`);
    const offerPromise = axios(`${WP_URL}offer/?per_page=100`);
    const regionPromise = axios(`${WP_URL}region/?per_page=100`);
    const ownerPromise = axios(`${WP_URL}owner/?per_page=100`);
    const campaign_groupPromise = axios(`${WP_URL}campaign_group/?per_page=100`);
    const segmentPromise = axios(`${WP_URL}segment/?per_page=100`);
    const market_scopePromise = axios(`${WP_URL}market_scope/?per_page=100`);
    const featured_marketPromise = axios(`${WP_URL}featured_markets/?per_page=100`);
    const program_typePromise = axios(`${WP_URL}program_type/?per_page=100`);

    const [ channel, brand, offer, region, owner, campaign_group, segment, market_scope, featured_market, program_type ] =
      await Promise.all(
        [channelPromise,
          brandPromise,
          offerPromise,
          regionPromise,
          ownerPromise,
          campaign_groupPromise,
          segmentPromise,
          market_scopePromise,
          featured_marketPromise,
          program_typePromise
        ]);

    const regions = region.data.map((r) => {
      return { id: r.id, slug: r.slug, count: r.count, name: decodeHTML(r.name), color: r.acf.color }
    });

    const channels = channel.data.map((c) => {
      return { id: c.id, slug: c.slug, count: c.count, name: decodeHTML(c.name), icon: c.acf.icon }
    });

    const offers = offer.data.map((o) => {
      return { id: o.id, slug: o.slug, count: o.count, name: decodeHTML(o.name), color: o.acf.color }
    });

    const brands = brand.data.filter((b) => { return b.acf.group === false; }).map((b) => {
      return { id: b.id, slug: b.slug, count: b.count, image: b.acf.logo, abreviation: b.acf.abreviation, name: decodeHTML(b.name) }
    });

    const brand_groups = brand.data.filter((bg) => bg.acf.group === true).map((bg) => {
      return { id: bg.id, slug: bg.slug, count: bg.count, name: decodeHTML(bg.name), preset: bg.acf.preset, brands: bg.acf.sub_brands.map(b => find(brand.data, i => i.id === b).id) }
    });

    const featured_markets = featured_market.data.map((b) => {
      return { id: b.id, slug: b.slug, count: b.count, name: decodeHTML(b.name) }
    });

    const campaign_groups = campaign_group.data.map((o) => {
      return { id: o.id, slug: o.slug, count: o.count, name: decodeHTML(o.name) }
    });

    const market_scopes = market_scope.data.map((o) => {
      return { id: o.id, slug: o.slug, count: o.count, name: decodeHTML(o.name) }
    });

    const program_types = program_type.data.map((o) => {
      return { id: o.id, slug: o.slug, count: o.count, name: decodeHTML(o.name) }
    });

    const segments = segment.data.map((o) => {
      return { id: o.id, slug: o.slug, count: o.count, name: decodeHTML(o.name) }
    });

    const owners = owner.data.map((o) => {
      return { id: o.id, slug: o.slug, count: o.count, name: decodeHTML(o.name) }
    }); 
    
    const brands_data = brand.data;

    return { channels, brands, brand_groups, offers, regions, featured_markets, campaign_groups, market_scopes, program_types, segments, owners, brands_data};

  } catch (e) {
    console.error(e);
  }
}

export async function getFirstEventsData(metaData) {
  try {

    const entry1Promise = axios(`${WP_URL}entry/?per_page=100&orderby=modified&page=1`);

    const [
      entry1
    ] =
      await Promise.all(
        [
          entry1Promise
        ]);

    const entriesALL = [
      ...entry1.data   
    ];

    return entriesALL.map(e => prepareEvent(e, metaData));


  } catch (e) {
    console.error(e);
  }
}


export async function getRestEventsData(metaData) {
  try {
    const parameters = '/?per_page=100&orderby=modified';

    const entry2Promise = axios(`${WP_URL}entry${parameters}&page=2`); // DISABLE 1
    const entry3Promise = axios(`${WP_URL}entry${parameters}&page=3`); // DISABLE 2
    const entry4Promise = axios(`${WP_URL}entry${parameters}&page=4`); // DISABLE 3
    const entry5Promise = axios(`${WP_URL}entry${parameters}&page=5`); // DISABLE 4
    const entry6Promise = axios(`${WP_URL}entry${parameters}&page=6`); // DISABLE 4

    const [
      entry2, // DISABLE 1
      entry3, // DISABLE 2
      entry4, // DISABLE 3
      entry5,  // DISABLE 4
      entry6,  // DISABLE 4
    ] =
      await Promise.all(
        [
          entry2Promise,  // DISABLE 1
          entry3Promise,  // DISABLE 2
          entry4Promise,  // DISABLE 3
          entry5Promise,   // DISABLE 4
          entry6Promise,   // DISABLE 4
        ]);

    const entriesALL = [
      ...entry2.data, // DISABLE 1
      ...entry3.data, // DISABLE 2
      ...entry4.data, // DISABLE 3
      ...entry5.data, // DISABLE 4       
      ...entry6.data // DISABLE 4       
    ];

    return entriesALL.map(e => prepareEvent(e, metaData));
    

  } catch (e) {
    console.error(e);
  }
}

export async function getEventsData(metaData) {
  try {
    const parameters = '/?per_page=100&orderby=modified';

    const entry1Promise = axios(`${WP_URL}entry${parameters}&page=1`); // DISABLE 0
    const entry2Promise = axios(`${WP_URL}entry${parameters}&page=2`); // DISABLE 1
    const entry3Promise = axios(`${WP_URL}entry${parameters}&page=3`); // DISABLE 2
    const entry4Promise = axios(`${WP_URL}entry${parameters}&page=4`); // DISABLE 3
    const entry5Promise = axios(`${WP_URL}entry${parameters}&page=5`); // DISABLE 4
    const entry6Promise = axios(`${WP_URL}entry${parameters}&page=6`); // DISABLE 4

    const [
      entry1, // DISABLE 0
      entry2, // DISABLE 1
      entry3, // DISABLE 2
      entry4, // DISABLE 3
      entry5,  // DISABLE 4
      entry6,  // DISABLE 4
    ] =
      await Promise.all(
        [
          entry1Promise,  // DISABLE 0
          entry2Promise,  // DISABLE 1
          entry3Promise,  // DISABLE 2
          entry4Promise,  // DISABLE 3
          entry5Promise,   // DISABLE 4
          entry6Promise,   // DISABLE 4
        ]);

    const entriesALL = [
      ...entry1.data, // DISABLE 0
      ...entry2.data, // DISABLE 1
      ...entry3.data, // DISABLE 2
      ...entry4.data, // DISABLE 3
      ...entry5.data, // DISABLE 4       
      ...entry6.data // DISABLE 4       
    ];

    return entriesALL.map(e => prepareEvent(e, metaData));


  } catch (e) {
    console.error(e);
  }
}

export async function getLatestEventsData(perPage) {
  try {
    const latestEntriesPromise = axios(`${WP_URL}entry/?per_page=${perPage > 100 ? 100 : perPage}&orderby=modified`);
    const [ latestEntries ] = await Promise.all( [ latestEntriesPromise ]);

    return latestEntries.data.map(e => prepareEvent(e));

  } catch (e) {
    console.error(e);
  }
}

export const prepareEvent = (e, metaData) => {

  if(metaData === undefined)  {
    const RefLocalStorage_Meta = localStorage.getItem('mrt_' + _CACHE + '_Meta-' + month(today()) + "-" + year(today()));
    // metaData = JSON.parse(atob(RefLocalStorage_Meta));
    metaData = JSON.parse(RefLocalStorage_Meta);
  }

  const dates = {
    sell: {
      start: e.acf.dates.sell.start,
      end: e.acf.dates.sell.end
    },
    stay: {
      start: e.acf.dates.stay.start,
      end: e.acf.dates.stay.end
    }
  };

  if(dates.stay.start === "" && dates.stay.end === "" && (dates.sell.start !== "" || dates.sell.end !== "") ) {
    dates.stay = dates.sell;
  }

  const _brands = e.brand.length > 0 ? e.brand : [find(metaData.brands_data, x => x.slug === 'no-brand').id];
  const _channels = e.channel.length > 0 ? e.channel : [find(metaData.channels, x => x.slug === 'no-channel').id];
  // const _featured_markets = e.featured_markets.length > 0 ? e.featured_markets : [find(metaData.featured_markets, x => x.slug === 'no-featured_markets').id];

  // console.log(_featured_markets);

  const _featured_markets = e.featured_markets[0] ? find(metaData.featured_markets, x => x.id === e.featured_markets[0]) : find(metaData.featured_markets, x => x.slug === 'no-featured-market');

  const _offers = e.offer[0] ? find(metaData.offers, x => x.id === e.offer[0]) : find(metaData.offers, x => x.slug === 'no-offer');
  const _campaign_groups = e.campaign_group[0] ? find(metaData.campaign_groups, x => x.id === e.campaign_group[0]) : find(metaData.campaign_groups, x => x.slug === 'no-campaign-group');
  const _market_scopes = e.market_scope[0] ? find(metaData.market_scopes, x => x.id === e.market_scope[0]) : find(metaData.market_scopes, x => x.slug === 'no-market-scope');
  const _program_types = e.program_type[0] ? find(metaData.program_types, x => x.id === e.program_type[0]) : find(metaData.program_types, x => x.slug === 'no-program-type');
  const _owners = e.owner[0] ? find(metaData.owners, x => x.id === e.owner[0]) : find(metaData.owners, x => x.slug === 'no-owner');
  const _regions = e.region[0] ? find(metaData.regions, x => x.id === e.region[0]) : find(metaData.regions, x => x.slug === 'no-region');
  const _segments = e.segment[0] ? find(metaData.segments, x => x.id === e.segment[0]) : find(metaData.segments, x => x.slug === 'no-segment');
  const _status = e.acf.status === undefined ? true : e.acf.status;
  
  // console.log(e.id, decodeHTML(e.title.rendered), _status);

  // console.log(e);

  // console.log(auth());

  // if (false){
  if (e.acf.status === false){
    // console.log(e.acf.status);
    axios({
      method: 'delete',
      url: WP_URL + "entry/" + e.id,
      headers: auth(),
      }).then(function (response) {
        console.log('deleted', e.id);
      }).catch(function (error) {
        console.log('failed', error);
    });
  }

  return {   
    id: e.id,
    wp_link: e.link,

    campaign_name: decodeHTML(e.title.rendered) || '',
    description: e.acf.description || '',

    region: [{ id: _regions.id, color: _regions.color, name: _regions.name}],
    brands: [...new Set(_brands.reduce(
    (bs, b) => {
      const _brand = find(metaData.brands_data, i => i.id === b);
      return _brand.acf.group ? [..._brand.acf.sub_brands, ...bs] : [b, ...bs];
    }
    ,[]))],
    channels: _channels,
    offer: [{ id: _offers.id, name: _offers.name, color: _offers.color }],
    featured_market: [{ id: _featured_markets.id, name: _featured_markets.name }],
    // featured_market: _featured_markets,
    market_more: e.acf.market_more,
    landing_page_url: e.acf.landing_page_url,
    creative_url: e.acf.creative_url,
    campaign_group: [{ id: _campaign_groups.id, name: _campaign_groups.name }],
    market_scope: [{ id: _market_scopes.id, name: _market_scopes.name }],
    program_type: [{ id: _program_types.id, name: _program_types.name }],
    segment: [{ id: _segments.id, name: _segments.name }],
    owner: [{ id: _owners.id, name: _owners.name }],

    otherChannels: e.acf.other_channels || '',
    ongoing: e.acf.dates.ongoing,
    datesType: isMultidate(dates) ? 'MULTIDATE' : 'SINGLEDATE',

    dates: dates,
    earliestDay: getExtreme([dates.sell.start, dates.stay.start], 'left'),
    latestDay: getExtreme([dates.sell.end, dates.stay.end], 'right'),
    status: _status,
    date_created: e.date,
    date_modified: e.modified,
    activity_log: e.acf.activity_log !== undefined && typeof e.acf.activity_log === 'object' ? e.acf.activity_log : {}
  }
}