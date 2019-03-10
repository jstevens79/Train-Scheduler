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

var currentLoaded = []

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
  var tName = $('<div>').addClass('trainName').text(trainName);
  var tDestination = $('<div>').addClass('trainDestination').text(destination);
  var tFirstTime = $('<div>').addClass('trainFirstTime').text(firstTime);
  var tFrequency = $('<div>').addClass('trainFrequency').text(frequency);
  trainObj.append(tName, tDestination, tFirstTime, tFrequency);
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

var currentMinutes = null;
var currentHour = null;
// get current time
function getTime(){
  var currentTime = moment();
  currentTime = moment(currentTime).format("hh:mm");
  var minutes = moment().minutes();
  //var hour = moment().hours();

  if (currentMinutes !== minutes) {
    currentMinutes = minutes
    console.log(currentMinutes)
  }

}

getTime()
var timeInterval = setInterval(getTime, 500); // to be a little more accurate to the second

function updateTrainArrival(freq, first, currentHour) {
  //var tFrequency = 17;
  //var firstTime = "03:00";

  var firstTimeConverted = moment(first, "HH:mm").subtract(1, "years");

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

  // Time apart (remainder)
  var tRemainder = diffTime % freq;

  // Minute Until Train
  var tMinutesTillTrain = freq - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

}

