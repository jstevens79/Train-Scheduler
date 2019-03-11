

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
var timeInterval = setInterval(getTime, 500);

function renderForm(key, tName, tDest, tFirst, tFreq) {
  var nameContainer = $('<div>').addClass('formGroup');
  var nameInput = $('<input>').attr('id', 'name-' + key);
  nameInput.attr('placeholder', tName);
  nameContainer.append('<label>Train Name</label>', nameInput);

  var destContainer = $('<div>').addClass('formGroup');
  var destInput = $('<input>').attr('id', 'dest-' + key);
  destInput.attr('placeholder', tDest);
  destContainer.append('<label>Destination</label>', destInput);

  var firstTimeContainer = $('<div>').addClass('formGroup');
  var firstInput = $('<input>').attr('id', 'first-' + key);
  firstInput.attr('placeholder', tFirst);
  firstTimeContainer.append('<label>First Train Time (hh:mm)</label>', firstInput);

  var freqContainer = $('<div>').addClass('formGroup');
  var freqInput = $('<input>').attr('id', 'freq-' + key);
  freqInput.attr('placeholder', tFreq);
  freqContainer.append('<label>Train Frequency (hh:mm)</label>', freqInput);

  var submitBttn = $('<button>').attr('data-key', key).addClass('update').html('<i class="far fa-save"></i><span>Save</span>');
  var cancelBttn = $('<button>').attr('data-key', key).addClass('cancel').html('<i class="fas fa-times"></i><span>Cancel</span>');
  var trainForm = $('<form>').addClass('inputForm');

  trainForm.append(nameContainer, destContainer, firstTimeContainer, freqContainer, submitBttn, cancelBttn);
  return trainForm;
}

function renderTrainObj(id, trainName, destination, firstTime, frequency) {
  var trainTimes = updateTrainArrival(frequency, firstTime, currentTime);
  var trainRow = $('#' + id);
  trainRow.attr('data-frequency', frequency);
  trainRow.attr('data-first-time', firstTime);
  var tName = $('<div>').addClass('trainName').text(trainName);
  var tDestination = $('<div>').addClass('trainDestination').text(destination);
  var tFrequency = $('<div>').addClass('trainFrequency').text(frequency);
  var nextArrival = $('<div>').addClass('nextArrival').text(trainTimes.nextArrival);
  var minutesAway = $('<div>').addClass('minutesAway').text(trainTimes.minutesAway);
  var editButton = $('<button>').addClass('edit').attr('data-key', id).html('<i class="far fa-edit"></i>');
  var deleteButton = $('<button>').addClass('delete').attr('data-key', id).html('<i class="far fa-trash-alt"></i>');
  var settings = $('<div>').addClass('editSettings').append(editButton, deleteButton);
  return [tName, tDestination, tFrequency, nextArrival, minutesAway, settings]
}

///////////////// DATABASE INTERFACING ///////////////// 
$('#add-train').click(function() {
  database.ref().push({
    initiated: false
  })
});


database.ref().on("child_added", function(childSnapshot) {
  var trainObj = $('<div>').addClass('trainRow').attr('id', childSnapshot.key);
  if (childSnapshot.val().initiated) {
    trainObj.attr('data-frequency', childSnapshot.val().frequency);
    trainObj.attr('data-first-time', childSnapshot.val().firstTime);
    trainObj.html(renderTrainObj(
      childSnapshot.key,
      childSnapshot.val().trainName,
      childSnapshot.val().destination,
      childSnapshot.val().firstTime,
      childSnapshot.val().frequency
    ))
  } else {
    trainObj.html(renderForm(childSnapshot.key))
  }
  
  $('#trains').append(trainObj);
})

database.ref().on("child_changed", function(childSnapshot) {
  $('#' + childSnapshot.key).html(renderTrainObj(
    childSnapshot.key,
    childSnapshot.val().trainName,
    childSnapshot.val().destination,
    childSnapshot.val().firstTime,
    childSnapshot.val().frequency
  ))
})

database.ref().on("child_removed", function(oldChildSnapshot) {
  $('#' + oldChildSnapshot.key ).remove();
})

function addTrainObj(name, destination, first, frequency) {
  database.ref().push({
    trainName: name,
    destination: destination,
    firstTime: first,
    frequency: frequency
  })
}


function updateTrainArrival(freq, first, currentHour) {
  var firstTimeConverted = moment(first, "HH:mm").subtract(1, "years");
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  var tRemainder = diffTime % freq;
  var tMinutesTillTrain = freq - tRemainder;
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  return {nextArrival: moment(nextTrain).format("hh:mm"), minutesAway: tMinutesTillTrain}
}

// Handle additions, edits, and deletions
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

$(document).on('click', '.edit', function(e) {
  e.preventDefault();
  var myKey = $(this).data('key');
  
  database.ref(myKey).once('value').then(function(snapshot) {
    $('#' + myKey).empty().html(renderForm(
      myKey,
      snapshot.val().trainName,
      snapshot.val().destination,
      snapshot.val().firstTime,
      snapshot.val().frequency)
    );
  });
})

$(document).on('click', '.delete', function(e) {
  e.preventDefault();
  var myKey = $(this).data('key');
  database.ref(myKey).remove();
})

$(document).on('click', '.cancel', function(e) {
  e.preventDefault();
  var myKey = $(this).data('key');
  console.log(myKey)
})


$(document).on('click', '.update', function(e) {
  e.preventDefault();
  var myKey = $(this).data('key');

  var valsToUpdate = {initiated: true, lastUpdate: moment().format('x')};

  if ($('#name-' + myKey).val() !== '') {
    valsToUpdate.trainName = $('#name-' + myKey).val().trim()
  }

  if ($('#dest-' + myKey).val() !== '') {
    valsToUpdate.destination = $('#dest-' + myKey).val().trim()
  }

  if ($('#first-' + myKey).val() !== '') {
    valsToUpdate.firstTime = $('#first-' + myKey).val().trim()
  }

  if ($('#freq-' + myKey).val() !== '') {
    valsToUpdate.frequency = $('#freq-' + myKey).val().trim()
  }

  database.ref(myKey).update(valsToUpdate);  
})
