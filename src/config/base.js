import Rebase from 're-base';
import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({apiKey: "AIzaSyCBNG1LOHfk78TFsMeK1ZJNY1O_-Iy7mxY", authDomain: "mrt-test-2a817.firebaseapp.com", databaseURL: "https://mrt-test-2a817.firebaseio.com"});

const base = Rebase.createClass(firebaseApp.database());

export { firebaseApp };

export default base;
