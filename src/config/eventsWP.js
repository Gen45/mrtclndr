import axios from 'axios';

import find from 'lodash/find';

import {
  getExtreme, isMultidate
} from '../helpers/dates';

import {
  decodeHTML
} from '../helpers/misc';

const WP_URL = 'http://admin.marriottcalendar.com/wp-json/wp/v2/';
const parameters = '/?per_page=100';
const short = '/?per_page=10';

export async function eventsData() {
  try {

    let entries = [];

    const channelPromise = axios(`${WP_URL}channel${parameters}`);
    const brandPromise = axios(`${WP_URL}brand${parameters}`);
    const offerPromise = axios(`${WP_URL}offer${parameters}`);
    const regionPromise = axios(`${WP_URL}region${parameters}`);
    const ownerPromise = axios(`${WP_URL}owner${parameters}`);
    const campaign_groupPromise = axios(`${WP_URL}campaign_group${parameters}`);
    const segmentPromise = axios(`${WP_URL}segment${parameters}`);
    const market_scopePromise = axios(`${WP_URL}market_scope${parameters}`);
    const featured_markets1Promise = axios(`${WP_URL}featured_markets${parameters}&page=1`);
    const featured_markets2Promise = axios(`${WP_URL}featured_markets${parameters}&page=2`);
    const program_typePromise = axios(`${WP_URL}program_type${parameters}`);
    // const entry1Promise = axios(`${WP_URL}entry${parameters}&page=1`); // DISABLE 0
    // const entry2Promise = axios(`${WP_URL}entry${parameters}&page=2`); // DISABLE 1
    const entry3Promise = axios(`${WP_URL}entry${short}&page=3`); // DISABLE 2
    // const entry4Promise = axios(`${WP_URL}entry${parameters}&page=4`); // DISABLE 3
    // const entry5Promise = axios(`${WP_URL}entry${parameters}&page=5`); // DISABLE 4

    const [
      channel,
      brand,
      offer,
      region,
      owner,
      campaign_group,
      segment,
      market_scope,
      featured_markets1,
      featured_markets2,
      program_type,
      // entry1, // DISABLE 0
      // entry2, // DISABLE 1
      entry3, // DISABLE 2
      // entry4, // DISABLE 3
      // entry5,  // DISABLE 4
    ] =
    await Promise.all(
      [channelPromise,
        brandPromise,
        offerPromise,
        regionPromise,
        ownerPromise,
        campaign_groupPromise,
        segmentPromise,
        market_scopePromise,
        featured_markets1Promise,
        featured_markets2Promise,
        program_typePromise,
        // entry1Promise, // DISABLE 0
        // entry2Promise,  // DISABLE 1
        entry3Promise,  // DISABLE 2
        // entry4Promise,  // DISABLE 3
        // entry5Promise,   // DISABLE 4
      ]);


    const featured_marketsALL = [...featured_markets1.data, ...featured_markets2.data];

    const entriesALL = [
      // ...entry1.data, // DISABLE 0
      // ...entry2.data, // DISABLE 1
      ...entry3.data, // DISABLE 2
      // ...entry4.data, // DISABLE 3
      // ...entry5.data // DISABLE 4       
      ];

    console.log(entriesALL);

    const regions = region.data.map((r) => {
      return {
        id: r.id,
        slug: r.slug,
        count: r.count,
        name: decodeHTML(r.name),
        color: r.acf.color
      }
    });

    const channels = channel.data.map((c) => {
      return {
        id: c.id,
        slug: c.slug,
        count: c.count,
        name: decodeHTML(c.name),
        icon: c.acf.icon
      }
    });

    const offers = offer.data.map((o) => {
      return {
        id: o.id,
        slug: o.slug,
        count: o.count,
        name: decodeHTML(o.name),
        color: o.acf.color
      }
    });    
    
    const brands = brand.data.filter( (b) => { return b.acf.group === false; }).map((b) => {
      return {
        id: b.id,
        slug: b.slug,
        count: b.count,
        image: b.acf.logo,
        abreviation: b.acf.abreviation,
        name: decodeHTML(b.name)
      }
    });

    const brandGroups = brand.data.filter( (bg) => bg.acf.group ===  true ).map((bg) => {
      return {
        id: bg.id,
        slug: bg.slug,
        count: bg.count,
        name: decodeHTML(bg.name),
        brands: bg.acf.sub_brands.map(b => find(brand.data, i => i.id === b).slug)
      }
    });

    // var t0 = performance.now();
    entries = entriesALL.map(e => {

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

      return {
        id: e.id,
        wp_link: e.link,
        region: [find(regions, r => r.id === e.region[0])],
        brands: [...new Set(e.brand.reduce(
          (bs, b) => {
            const _brand = find(brand.data, i => i.id === b);
            return _brand.acf.group ? [..._brand.acf.sub_brands, ...bs] : [b, ...bs];
          }
          ,[]))].map(b => find(brand.data, i => i.id === b).slug ),
        channels: e.channel.map(c => find(channels, i => i.id === c)),
        campaignName: decodeHTML(e.title.rendered),
        description: e.acf.description,
        owner: e.owner[0] ? {
          name: find(owner.data, o => o.id === e.owner[0]).name
        } : {},
        campaignGroup: find(campaign_group.data, cg => cg.id === e.acf.campaign_group).name,
        segment: e.segment[0] ? find(segment.data, s => s.id === e.segment[0]).name : null,
        market: e.featured_markets[0] ? find(featured_marketsALL, fm => fm.id === e.featured_markets[0]).name : null,
        marketScope: e.market_scope[0] ? find(market_scope.data, ms => ms.id === e.market_scope[0]).name : null,
        programType: e.program_type[0] ? find(program_type.data, pt => pt.id === e.program_type[0]).name : null,
        offer: e.offer[0] ? [{
          name: find(offer.data, o => o.id === e.offer[0]).name,
          color: find(offer.data, o => o.id === e.offer[0]).acf.color,
          id: find(offer.data, o => o.id === e.offer[0]).id,
          slug: find(offer.data, o => o.id === e.offer[0]).slug
        }] : [{}],
        otherChannels: e.acf.other_channels,
        ongoing: e.acf.dates.ongoing,
        datesType: isMultidate(dates) ? 'MULTIDATE' : 'SINGLEDATE',
        dates,
        earliestDay: getExtreme([dates.sell.start, dates.stay.start], 'left'),
        latestDay: getExtreme([dates.sell.end, dates.stay.end], 'right')
      }
    });

    // console.log(i)
    // var t1 = performance.now();


    // console.log(entriesALL);

    return {
      entries,
      channels,
      brands,
      brandGroups,
      offers,
      regions
    };

  } catch (e) {
    console.error(e);
  }
}

export default eventsData;