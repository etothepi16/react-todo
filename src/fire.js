import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyAFkwCFNQFGKC_T8XUKuRsVHVzyhgdJf8s",
    authDomain: "todo-list-19341.firebaseapp.com",
    databaseURL: "https://todo-list-19341.firebaseio.com",
    projectId: "todo-list-19341",
    storageBucket: "",
    messagingSenderId: "302280230403",
    appId: "1:302280230403:web:47c9e54ca0b9501b"
};
var fire = firebase.initializeApp(config);
export default fire;