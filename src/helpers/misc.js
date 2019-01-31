import ReactDOM from 'react-dom';

export const isValid = value => value !== '' && value !== null && value !== undefined;
export const isValidAndTrue = value => (value !== '' || value !== null || value !== undefined) && value === true;

export const getCoordinates = element => ReactDOM.findDOMNode(element);

export const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));

export const keyGenerator = (num, dic) => {
  num = num || 4;
  dic = dic || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let word = '';
  for(let i = 0; i < num; i++){
    word += dic[getRandomInt(dic.length)];
  }
  return word;
}

export const decodeHTML =  (html) => {
  var txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

export const removeSearched = (str) => {
  if (typeof str === 'string'){
    return str
      .replace(/<b class="searched">/g, '')
      .replace(/<\/b>/g, '');
  } else {
    return '';
  }
}

export const urlify = (text) => {
    var wwwRegex = /^(www\.[^\s]+)/g;
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(wwwRegex, function(url) {
      return 'http://' + url;
    })    
    .replace(urlRegex, function(url) {
      return '<a target="_blank" rel="noopener noreferrer" href="' + url + '">' + url + '</a>';
    })
}