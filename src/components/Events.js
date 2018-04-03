import React from 'react';
import ReactList from 'react-list';
import LazyLoading from 'react-list-lazy-load';
import Event from './Event/Event';

const Events = ({ items, onRequestPage }) => (
  <LazyLoading
    length={items.length}
    items={items}
    onRequestPage={onRequestPage}
  >
    <ReactList
      itemRenderer={(idx, key) => (
        <Event /> <div key={key}>{items[idx]}</div>
      )}
      type="uniform"
      length={items.length}
    />
  </LazyLoading>
);

export default Events;
