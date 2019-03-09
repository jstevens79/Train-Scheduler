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

// here's how to handle the add button
function addTrainObj(name, destination, first, frequency) {
  database.ref().push({
    trainName: name,
    destination: destination,
    firstTime: first,
    frequency: frequency
  })
}

function renderTrainObj(id, trainName, destination, firstTime, frequency) {
  var trainObj = $('<div>').addClass('trainRow');
  trainObj.attr('id', id);
  trainObj.text(trainName + ' ' + destination + ' ' + firstTime + ' ' + frequency);
  $('#trains').append(trainObj)
}

database.ref().on("child_added", function(childSnapshot) {
  renderTrainObj(
    childSnapshot.key,
    childSnapshot.val().trainName,
    childSnapshot.val().destination,
    childSnapshot.val().firstTime,
    childSnapshot.val().frequency
  )
})

database.ref().on("child_changed", function(childSnapshot) {
  console.log(childSnapshot)
})

$('#train-add').click(function(e) {
  e.preventDefault()
  var trainName = $('#train-name').val().trim();
  var trainDestination = $('#train-destination').val().trim()
  var trainFirstTime = $('#train-first-time').val();
  var trainFrequency = $('#train-frequency').val();
  addTrainObj(trainName, trainDestination, trainFirstTime, trainFrequency);

  $('#train-name').val('');
  $('#train-destination').val('');
  $('#train-first-time').val('');
  $('#train-frequency').val('');

})