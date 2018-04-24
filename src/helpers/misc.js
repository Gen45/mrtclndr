import ReactDOM from 'react-dom';

export const isValid = value => value !== '' && value !== null && value !== undefined;

export const getCoordinates = element => ReactDOM.findDOMNode(element);
