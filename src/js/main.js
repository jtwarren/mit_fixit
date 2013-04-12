/////////////////////////////////////////////////////////
// Main JS files for loading document. 
/////////////////////////////////////////////////////////

// An array listing all of the jobs.
var jobList = new Array(); 

$('document').ready(function() {
            
    // Populate the jobList with fake jobs.
    var job1 = new fixit.Job("Broken Lightbulb", "broke light bulb.",
        "East Penthouse", new Date()); 
    job1.setStatus("assigned");
    var job2 = new fixit.Job("Broken Lightbulb2", "broke light bulb.",
        "East Penthouse", new Date()); 
    var job3 = new fixit.Job("Broken Lightbulb3", "broke light bulb.",
        "East Penthouse", new Date()); 
    var job4 = new fixit.Job("Broken Lightbulb4", "broke light bulb.",
        "East Penthouse", new Date()); 
    job4.setStatus("completed")
    jobList.push(job1); 
    jobList.push(job2);
    jobList.push(job3); 
    jobList.push(job4); 
    loadJobs(); 
    
    // Makes each of the job clickable and will then trigger the right panel to update.
    $(".job").click(function (i) {
       console.log("clicked on this");  
    }); 
    
    // Make jobs scrollable
    $(".job-group").slimScroll({
        height: '160px'
    }); 
    
    loadAddressBook(); 
});


// Load the jobs in a task list for a particular 
function loadJobs() {
    for (var i=0; i<jobList.length; i++) {
        var currentJob = jobList[i];                      
        addJob(currentJob); 
   }
}

// Load a particular job.
function addJob(currentJob) {
        var jobContext = '<div class="job"> \
            <div class="starred"> <i class="icon-star"></i> </div> \
            <div class="mechanic-image"> <img src="'
            
        jobContext += currentJob.getAssignedToPic(); 
        jobContext += '" style="width:50px;" /> </div> \
                    <div class="job-description-text"> \
                    <div class="job-display-text">'
                    
        jobContext += currentJob.getTitle().substring(0, 50);
        jobContext += '</div> <span class="blurb-location">'
        jobContext += currentJob.getLocation(); 
        jobContext += '</span> <div class="blurb-time"> '
        jobContext += currentJob.getJobTime().toLocaleTimeString(); 
        jobContext += '</div> </div></div> ';
        
        if (currentJob.getStatus() == "unassigned" || 
            currentJob.getStatus() == "new") {
            $(jobContext).appendTo(".unassigned-jobs");
        } else if (currentJob.getStatus() == "assigned") {
            $(jobContext).appendTo(".assigned-jobs");
        } else if (currentJob.getStatus() == "completed") {
            $(jobContext).appendTo(".completed-jobs");  
        } else {
            // Job should not have a different status.
            // there is a problem with this job. 
            console.log('current status is invalid');
        }            
}

// Load Address book component. 
function loadAddressBook() {
    //data model
    var contactList = new Array();
    var alan = new Contact("Alan Michelson", "617-584-2094", "michelson@mit.edu");
    var becky = new Contact("Becky Folds", "617-543-1352", "beks@mit.edu");
    var jenks = new Contact("Jenks Jenkinson", "617-239-8971", "jenks@mit.edu");
    var homeDepot = new Contact("Home Depot", "617-940-0184", "contact@homedepot.com");
    contactList.push(alan);
    contactList.push(becky);
    contactList.push(jenks);
    contactList.push(homeDepot);
    //console.log(contactList.length);
    for(var c = 0; c < contactList.length; c++){
    	//console.log(c);
    	//var contacthtml = '<div class="contact" id="c' + c + '">' + contactList[c].name + '</div>';
    	var contacthtml = '<div class="contact" id="c' + c + '">' + '</div>';
    	//console.log(contacthtml);
    	var topLoc = c*80;
    	//console.log("#c" + c);
    	console.log(topLoc);
    	$("#table").append(contacthtml);
    	var name = '<div class="name" id="n' + c + '">' + contactList[c].name + '</div>';
    	var phone = '<div class="phone" id="p' + c + '">' + contactList[c].phone + '</div>';
    	var email = '<div class="email" id="e' + c + '">' + contactList[c].email + '</div>';
    	var contactImg = '<div class="imgdiv" id="i' + c + '"><img class="contactImg" src="images/default.png" /></div>';
    	var contactText = '<div class="contactText" id="t' + c + '">' + name + phone + email + '</div';
    	var typeImg = '<div><img class="typeImg" src="images/wrench.gif"/></div>';
    	//$("#c" + c).append(name);
    	//$("#c" + c).append(phone);
    	$("#c" + c).append(contactImg);
    	$("#c" + c).append(contactText);
    	$("#c" + c).append(typeImg);
    	$("#c" + c).css('top', topLoc + "px");
    	$("#c" + c).css('height', 77 + "px");
    	//$("#table").append('<div id="i"></div>');
    }
}

