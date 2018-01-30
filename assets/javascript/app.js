$(document).ready(function() {

    document.getElementById("demo").innerHTML = "CURRENT  TIME: " + " " + moment(currentTime).format("hh:mm");
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyACVVDckwQx3xLNWi7J3NkcwSsw-ikiy1Q",
        authDomain: "train-schedular-20a6b.firebaseapp.com",
        databaseURL: "https://train-schedular-20a6b.firebaseio.com",
        projectId: "train-schedular-20a6b",
        storageBucket: "train-schedular-20a6b.appspot.com",
        messagingSenderId: "53997774418"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    //Whenever a user clicks the click button this function execute
    $('#button').on('click', function(event) {

        event.preventDefault();
        var train = $('#trainName').val().trim();
        var destination = $('#destination').val().trim();
        var time = $('#time').val().trim();
        var frequency = $('#fre').val().trim();

        console.log(train);
        console.log(destination);
        console.log(time);
        console.log(frequency);

        database.ref().push({
            trainName: train,
            trainDestination: destination,
            trainTime: time,
            trainFrequency: frequency
        });
        $('.form-control').val('');
    });

    var tFrequency;
    var firstTimeConverted;
    var currentTime;
    var diffTime;
    var tRemainder;
    var tMinutes;
    var nextTrain;

    // This function helps to update the page in real-time 

    database.ref().on('child_added', function(snapshot) {
        console.log(snapshot.val());
        console.log(snapshot.val().trainName);
        console.log(snapshot.val().trainDestination);
        console.log(snapshot.val().trainTime);
        console.log(snapshot.val().trainFrequency);
        console.log("CURRENT TIME: " + moment().format('HH:mm'));

        tFrequency = snapshot.val().trainFrequency;

        firstTimeConverted = moment(tFrequency, "hh:mm").subtract(1, "hours");
        console.log(firstTimeConverted);

        // Current Time
        currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart
        tRemainder = diffTime % tFrequency;
        console.log(tRemainder);

        // Minute Until Train
        tMinutes = tFrequency - tRemainder;
        console.log("MINUTES Away: " + tMinutes);

        // Next Train
        nextTrain = moment(moment().add(tMinutes, "minutes")).format('hh:mm');
        console.log("Next Arrival: " + moment(nextTrain).format("hh:mm"));

        $('tbody').append('<tr><td>' + snapshot.val().trainName + '</td><td>' + snapshot.val().trainDestination + '</td><td>' +
            snapshot.val().trainFrequency + '</td><td id="trainUpdate">' + nextTrain + '</td><td id="minUpdate">' + tMinutes + '</td></tr>');

        setInterval(call, 5000);
    });
});