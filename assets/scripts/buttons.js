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
  database.ref(myKey).once('value').then(function(snapshot) {
    if (!snapshot.val().initiated) {
      database.ref(myKey).remove();
    } else {
      database.ref(myKey).update({ lastUpdate: moment().format('x')})
    }
  })

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