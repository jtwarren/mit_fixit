/////////////////////////////////////////////////////////
// Constructors for fixit.js models
/////////////////////////////////////////////////////////

var fixit = {};		// fixit is object representing a module that 
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

	// getter methods
	this.getStatus = function() {
		return status;
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
}
