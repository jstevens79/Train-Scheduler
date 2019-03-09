var config = {
  apiKey: "AIzaSyDSojtlXJJJCZMfGg_0sCqIMGTtinJrMhA",
  authDomain: "fir-test-1aa59.firebaseapp.com",
  databaseURL: "https://fir-test-1aa59.firebaseio.com",
  projectId: "fir-test-1aa59",
  storageBucket: "fir-test-1aa59.appspot.com",
  messagingSenderId: "417579575390"
};
firebase.initializeApp(config);

var database = firebase.database();

var trainInfo = [
  {
    trainName: 'Chatty Choo Choo',
    destination: 'Chattanooga',
    firstTime: '',
    frequency: ''
  },
  {
    trainName: 'Chatty Choo Choo 2',
    destination: 'Chattanooga',
    firstTime: '',
    frequency: ''
  },
  {
    trainName: 'Chatty Choo Choo 3',
    destination: 'Chattanooga',
    firstTime: '',
    frequency: ''
  }
]

trainInfo.forEach(function(train) {
  database.ref().push({
    trainName: train.trainName,
    destination: train.destination,
    firstTime: train.firstTime,
    frequency: train.frequency
  })
})

