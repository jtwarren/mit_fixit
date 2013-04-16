/////////////////////////////////////////////////////////
// Constructors for fixit.js models
/////////////////////////////////////////////////////////

var fixit = {};     // fixit is object representing a module that 
                    // contains fixit-specific
                    // functions, global variables, etc. (this is to 
                    // prevent namespace pollution)

fixit.Job = function(title, text, location, time) {
    /* Constructor for fixit.Job object. Takes following parameters:
     - title, a string
     - text, a string
     - location, a string
     - time, a JavaScript Date object (http://bit.ly/z7Sdm)
    */

    var title = title;
    var text = text;
    var location = location;
    var time = time;

    // default values for fields when new fixit.Job object is constructed
    var starred = false;
    var assignedTo = null;
    var status = "new";
    var updateList = new Array();
    var labelList = new Array();
    var assignedToPic = "images/default.png";

    // setter methods
    // Update the status of this job.
    this.setStatus = function(stat) {
        status = stat; 
    }

    this.addUpdate = function(update) {
        updateList.push(update);
    }

    // getter methods
    this.getTitle = function() {
        return title;
    }
    
    this.getText = function() {
        return text;
    }
    
    this.getLocation = function() {
        return location; 
    }
    
    this.getStatus = function() {
        return status;
    }
    
    this.getAssignedToPic = function() {
        return assignedToPic; 
    }

    this.getJobTime = function() {
        return time; 
    }

    this.getUpdateList = function() {
        return updateList;
    }
}

fixit.Update = function(updater, text, time, urgency) {
    /* Constructor for fixit.Update object. Takes following parameters:
     - updater, a string
     - text, a string
     - time, a JavaScript Date object (http://bit.ly/z7Sdm)
     - urgency, a boolean
    */

    var updater = updater;
    var text = text;
    var time = time;
    var urgency = urgency;

    this.getUpdater = function() {
        return updater;
    }
    this.getText = function() {
        return text;
    }
    this.getTime = function() {
        return time;
    }
}
