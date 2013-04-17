/////////////////////////////////////////////////////////
// Constructors for fixit.js models
/////////////////////////////////////////////////////////

var fixit = {};     // fixit is object representing a module that 
                    // contains fixit-specific
                    // functions, global variables, etc. (this is to 
                    // prevent namespace pollution)

fixit.Person = function(name, email, phone, profPic ) {
    var name = name;
    var email = email;
    var phone = phone;
    var picture = typeof profPic !== 'undefined' ? profPic:"images/default.png";

    this.getName = function() {
        return name;
    }

    this.getEmail = function() {
        return email;
    }

    this.getPhone = function() {
        return phone;
    }
    
    this.getPicture = function() {
        return picture; 
    }
    
}

fixit.Job = function(title, text, location, time, reporter) {
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
    var reporter = reporter;

    // default values for fields when new fixit.Job object is constructed
    var starred = false;
    var assignedTo = null;
    var status = "new";
    var updateList = new Array();
    var labelList = new Array();
 

    // setter methods
    // Update the status of this job.
    this.setStatus = function(stat) {
        status = stat; 
    }

    this.setWorker = function(worker){
    	assignedTo = worker;
    }

    this.addUpdate = function(update){
		updateList.push(update);
	}

    // getter methods
    this.getTitle = function() {
        return title;
    }

    this.getWorker = function() {
        return assignedTo;
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
        if (assignedTo === null ) {
            return "images/default.png";
        }
        return assignedTo.getPicture(); 
    }

    this.getJobTime = function() {
        return time; 
    }

	this.getUpdateList = function() {
		return updateList;
	}

    this.getReporter = function () {
        return reporter;
    }

    this.toggleStarred = function() {
        starred = !(starred);
    }

    this.isStarred = function() {
        return starred;
    }

	this.contains = function(searchText){
		return (title.toLowerCase().indexOf(searchText) != -1 || text.toLowerCase().indexOf(searchText) != -1 || location.toLowerCase().indexOf(searchText) != -1);
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
