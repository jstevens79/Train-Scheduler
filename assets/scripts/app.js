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


///////////////// GENERATE FORM /////////////////
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
  freqContainer.append('<label>Train Frequency (min)</label>', freqInput);

  var submitBttn = $('<button>').attr('data-key', key).addClass('update').html('<i class="far fa-save"></i><span>Save</span>');
  var cancelBttn = $('<button>').attr('data-key', key).addClass('cancel').html('<i class="fas fa-times"></i><span>Cancel</span>');
  var trainForm = $('<form>').addClass('inputForm');

  var column1 = $('<div>').addClass('formColumn');
  column1.append(nameContainer, destContainer);
  var column2 = $('<div>').addClass('formColumn');
  column2.append(firstTimeContainer, freqContainer);

  var controls = $('<div>').addClass('formControls');
  controls.append(submitBttn, cancelBttn);

  trainForm.append(column1, column2, controls);
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


