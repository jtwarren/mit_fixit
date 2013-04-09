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

	this.title = title;
	this.text = text;
	this.location = location;
	this.time = time;

	// default values for fields when new fixit.Job object is constructed
	this.starred = false;
	this.assignedTo = null;
	this.status = "new";
	this.updateList = new Array();
	this.labelList = new Array();
}

fixit.Update = function(updater, text, time, urgency) {
	/* Constructor for fixit.Update object. Takes following parameters:
	 - updater, a string
	 - text, a string
	 - time, a JavaScript Date object (http://bit.ly/z7Sdm)
	 - urgency, a boolean
	*/

	this.updater = updater;
	this.text = text;
	this.time = time;
	this.urgency = urgency;
}