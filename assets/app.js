

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

function renderTrainObj(id, trainName, destination, firstTime, frequency, update) {
  var trainTimes = updateTrainArrival(frequency, firstTime, currentTime);
  var trainObj
  
  if (update) {
    trainObj = $('#' + id);
    trainObj.empty();
  } else {
    trainObj = $('<div>').addClass('trainRow');
    trainObj.attr('id', id);
  }
  
  trainObj.attr('data-frequency', frequency);
  trainObj.attr('data-first-time', firstTime);
  var tName = $('<div>').addClass('trainName').text(trainName);
  var tDestination = $('<div>').addClass('trainDestination').text(destination);
  var tFrequency = $('<div>').addClass('trainFrequency').text(frequency);
  var nextArrival = $('<div>').addClass('nextArrival').text(trainTimes.nextArrival);
  var minutesAway = $('<div>').addClass('minutesAway').text(trainTimes.minutesAway);
  var edit = $('<div>').addClass('editSettings').append('<button class="edit" data-key="' + id + '">Edit</button>');
  trainObj.append(tName, tDestination, tFrequency, nextArrival, minutesAway, edit);

  if (!update) {
    $('#trains').append(trainObj);
  }
 
}

database.ref().on("child_added", function(childSnapshot) {
  renderTrainObj(
    childSnapshot.key,
    childSnapshot.val().trainName,
    childSnapshot.val().destination,
    childSnapshot.val().firstTime,
    childSnapshot.val().frequency,
    false
  )
})

database.ref().on("child_removed", function(oldChildSnapshot) {
  $('#' + oldChildSnapshot.key ).remove();
})

database.ref().on("child_changed", function(childSnapshot) {
  renderTrainObj(
    childSnapshot.key,
    childSnapshot.val().trainName,
    childSnapshot.val().destination,
    childSnapshot.val().firstTime,
    childSnapshot.val().frequency,
    true
  )
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


function updateTrainArrival(freq, first, currentHour) {
  var firstTimeConverted = moment(first, "HH:mm").subtract(1, "years");
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  var tRemainder = diffTime % freq;
  var tMinutesTillTrain = freq - tRemainder;
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  return {nextArrival: moment(nextTrain).format("hh:mm"), minutesAway: tMinutesTillTrain}
}

$(document).on('click', '.edit', function() {
  var myKey = $(this).data('key');
  
  database.ref(myKey).once('value').then(function(snapshot) {
    var nameForm = $('<input>').attr('id', 'updateName').attr('placeholder', snapshot.val().trainName);
    var destForm = $('<input>').attr('id', 'updateDest').attr('placeholder', snapshot.val().destination);
    var startForm = $('<input>').attr('id', 'updateStart').attr('placeholder', snapshot.val().firstTime);
    var freqForm = $('<input>').attr('id', 'updateFreq').attr('placeholder', snapshot.val().frequency);
    var update = $('<button>').addClass('update').attr('data-key', myKey).text('Update');
    $('#' + myKey).empty().append(nameForm, destForm, startForm, freqForm, update);  
  });


  // myRecord.update({frequency: 5})
  // to remove...
  //myRecord.remove()
  //console.log(myRecord.val().trainName)  

  // 

})

$(document).on('click', '.update', function() {
  var myKey = $(this).data('key');
  var valsToUpdate = {};

  if ($('#updateName').val() !== '') {
    valsToUpdate.trainName = $('#updateName').val().trim()
  }

  if ($('#updateDest').val() !== '') {
    valsToUpdate.destination = $('#updateDest').val().trim()
  }

  if ($('#updateStart').val() !== '') {
    valsToUpdate.firstTime = $('#updateStart').val().trim()
  }

  if ($('#updateFreq').val() !== '') {
    valsToUpdate.frequency = $('#updateFreq').val().trim()
  }

  database.ref(myKey).update(valsToUpdate);
  
})
