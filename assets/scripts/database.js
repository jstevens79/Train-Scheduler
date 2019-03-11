
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