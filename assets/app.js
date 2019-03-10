

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


///////////////// HANDLE TIME ///////////////// 

var currentTime = moment().format("hh:mm");

// get current time
function getTime(){
  var current = moment().format("hh:mm");

  if (currentTime !== current) {
    currentTime = current;
    
    // update the train rows
    $('.trainRow').each(function() {
      var frequency = $(this).data('frequency');
      var firstTime = $(this).data('first-time');
      var trainTimes = updateTrainArrival(frequency, firstTime, current);
      $(this).find('.nextArrival').text(trainTimes.nextArrival);
      $(this).find('.minutesAway').text(trainTimes.minutesAway);
    })

  }
}

getTime()
var timeInterval = setInterval(getTime, 500); // to be a little more accurate to the second


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
  var trainTimes = updateTrainArrival(frequency, firstTime, currentTime);
  var trainObj = $('<div>').addClass('trainRow');
  trainObj.attr('id', id);
  trainObj.attr('data-frequency', frequency);
  trainObj.attr('data-first-time', firstTime);
  var tName = $('<div>').addClass('trainName').text(trainName);
  var tDestination = $('<div>').addClass('trainDestination').text(destination);
  var tFrequency = $('<div>').addClass('trainFrequency').text(frequency);
  var nextArrival = $('<div>').addClass('nextArrival').text(trainTimes.nextArrival);
  var minutesAway = $('<div>').addClass('minutesAway').text(trainTimes.minutesAway);
  trainObj.append(tName, tDestination, tFrequency, nextArrival, minutesAway);
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




// need to do this for each of the trains
function updateTrainArrival(freq, first, currentHour) {
  var firstTimeConverted = moment(first, "HH:mm").subtract(1, "years");
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  var tRemainder = diffTime % freq;
  var tMinutesTillTrain = freq - tRemainder;
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  return {nextArrival: moment(nextTrain).format("hh:mm"), minutesAway: tMinutesTillTrain}
}

