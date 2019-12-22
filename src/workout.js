var app = angular.module("WorkoutApp", []);

app.controller('WorkoutController', function($http) {

    var workout = this;

    workout.started = false;
    workout.saved = false;

    // TODO Use these later
    workout.equipment = {
        "thick bar": 25,
        "ez curl bar": 15,
        "bench bar": 45
    }

    // To get around cors locally.. load from github
    $http.get('https://www.clickthisnick.com/workout-tracker/src/workout.json').success(function (data){
		workout.data = data;
    });

    workout.start = function(id) {
        // Changes the routine from the id to the whole entity
        // Also created arrays for reps and weight

        workout.started = true
        workout.currentRoutineId = id - 1
        workout.currentExerciseId = 0
        workout.exerciseCount = 0

        // Add new rep/weight entries to all exercises of loaded routine
        workout.data.routines[workout.currentRoutineId].exercises.forEach((exercise) => {
            // workout.data.routines[workout.currentRoutineId].exercises[workout.currentExerciseId]
            exercise.reps.push([])
            exercise.weight.push([])
            workout.exerciseCount += 1
        })

        workout.refreshWorkoutData()
    }

    workout.saveItems = function() {
        var currentExercise = workout.data.routines[workout.currentRoutineId].exercises[workout.currentExerciseId]

        // Incase not filled out
        if (workout.currentReps.length !== 0) {
            var repLength = currentExercise.reps.length
            currentExercise.reps[repLength - 1] = workout.currentReps.split(',')
        }

        // Incase not filled out
        if (workout.currentWeight.length !== 0) {
            var weightLength = currentExercise.weight.length
            currentExercise.weight[weightLength - 1] = workout.currentWeight.split(',')
        }
    }

    workout.refreshWorkoutData = function() {
        workout.previousExerciseData = workout.data.routines[workout.currentRoutineId].exercises[workout.currentExerciseId]

        // Handle first time using routine
        if (workout.previousExerciseData.reps.length > 1) {
            workout.previousExerciseReps = workout.previousExerciseData.reps.slice(Math.max(workout.previousExerciseData.reps.length - 2, 0))[0]
        } else {
            workout.previousExerciseReps = ""
        }

        if (workout.previousExerciseData.weight.length > 1) {
            workout.previousExerciseWeight = workout.previousExerciseData.weight.slice(Math.max(workout.previousExerciseData.weight.length - 2, 0))[0]
        } else {
            workout.previousExerciseWeight = ""
        }

        workout.currentExerciseData = workout.data.routines[workout.currentRoutineId].exercises[workout.currentExerciseId]

        // These will be string inputs on page, but array in data model
        workout.currentReps = workout.currentExerciseData.reps.slice(Math.max(workout.currentExerciseData.reps.length - 1, 0))[0].toString()
        workout.currentWeight = workout.currentExerciseData.weight.slice(Math.max(workout.currentExerciseData.weight.length - 1, 0))[0].toString()
    }

    workout.nextExercise = function() {
        // TODO should just disable button if not available
        if (workout.currentExerciseId < workout.exerciseCount - 1) {
            workout.saveItems()
            workout.currentExerciseId += 1
            workout.refreshWorkoutData()
        }
    }

    workout.previousExercise = function() {
        if (workout.currentExerciseId > 0) {
            workout.saveItems()
            workout.currentExerciseId -= 1
            workout.refreshWorkoutData()
        }
    }

    workout.generateJSON = function() {
        workout.saved = true;
        var jsonData = JSON.stringify(workout.data)
        var jsonFirst = jsonData.substr(1);
        workout.json = jsonFirst.substring(0, jsonFirst.length - 1);
    }
})

