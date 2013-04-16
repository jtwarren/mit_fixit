/////////////////////////////////////////////////////////
// Main JS files for loading document. 
/////////////////////////////////////////////////////////

// An array listing all of the jobs.
var jobList = new Array(); 
var contactList = new Array();

$('document').ready(function() {
            
    // Populate the jobList with fake jobs.
    var job1 = new fixit.Job("Broken Lightbulb", "Ran into the lightbulb, glass everywhere, sorry",
        "McCormick East Penthouse", new Date()); 
    job1.setStatus("assigned");
    var job2 = new fixit.Job("Door doesn't lock", "I don't feel safe leaving my door unlocked at night. Can you please come fix this asap?",
        "McCormick room 501", new Date()); 
    var job3 = new fixit.Job("Elevator broken", "Doors won't open",
        "McCormick East Tower", new Date()); 
    var job4 = new fixit.Job("Window screen missing", "Can't leave my window open because there's no screen",
        "McCormick room 210", new Date()); 
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

    loadAddressBook();
    filterContacts();

    var jj = new fixit.Job("TEST", "TEST",
    "TEST", new Date());
    var person = new fixit.Person("Jeffrey Warren", "jtwarren@mit.edu", "603.438.6440");
    var update = new fixit.Update(person, "yo dosldfsd fjsdlfk jsdlfj sdflsd jflsdfsdlfk sdlf sdlfkjsdlfksdjflkjs fjlksd fsjdl fksdl kg, sick update", new Date(), "urgency")
    var update2 = new fixit.Update(person, "yo dofosdljsdlkfjn sdfhjasnfisdjkfhosdfj hi udsajohas djhaj sdiasdhas jdg akjsd jhsdg iaksjhdkas hadskjahsdkash g, sick update", new Date(), "urgency")
    jj.addUpdate(update);
    jj.addUpdate(update2);
    replaceDetails(jj);

    filterJobs();
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
    
    var job = $(jobContext);
    $(job).click(function() {
        replaceDetails(currentJob);
    });
    
    if (currentJob.getStatus() == "unassigned" || 
        currentJob.getStatus() == "new") {
        $(".unassigned-jobs").append(job);
    } else if (currentJob.getStatus() == "assigned") {
        $(".assigned-jobs").append(job);
    } else if (currentJob.getStatus() == "completed") {
        $(".completed-jobs").append(job);  
    } else {
        // Job should not have a different status.
        // there is a problem with this job. 
        console.log('current status is invalid');
    }            
}

// Replace the details for a given job
function replaceDetails(job) {
    $(".description-panel .description .job-title h4").html(job.getTitle());
    $(".description-panel .description .job-location").html(job.getLocation());
    $(".description-panel .description .job-description").html(job.getText());

    $(".updates").empty();
    $(".updates").append($('<h4>Updates</h4>'))

    $.each(job.getUpdateList(), function(index, update) {
        var $update = $('<div class="update"/>');
        var $img = $('<div><img class="update-image" style="width:50px" src="images/default.png"/></div>');
        var $updateText = $('<div class="update-text"/>');
        $updateText.append($('<span class="username">' + update.getUpdater().getName() + " " + '</span>'));
        $updateText.append(update.getText());
        $updateText.append($('<div class="time">' + update.getTime() + '</div>'));

        $update.append($img);
        $update.append($updateText);
        $(".updates").append($update);
    });
}


// Load Address book component. 
function loadAddressBook() {
    //data model
    var alan = new Contact("Alan Michelson", "617-584-2094", "michelson@mit.edu");
    var becky = new Contact("Becky Folds", "617-543-1352", "beks@mit.edu");
    var jenks = new Contact("Jenks Jenkinson", "617-239-8971", "jenks@mit.edu");
    var homeDepot = new Contact("Home Depot", "617-940-0184", "contact@homedepot.com");
    contactList.push(alan);
    contactList.push(becky);
    contactList.push(jenks);
    contactList.push(homeDepot);

    for(var c = 0; c < contactList.length; c++){
    	
    	var contacthtml = '<div class="contact" id="c' + c + '">' + '</div>';
    	var topLoc = c*80;
    	$("#table").append(contacthtml);
    	var name = '<div class="name" id="n' + c + '">' + contactList[c].name + '</div>';
    	var phone = '<div class="phone" id="p' + c + '">' + contactList[c].phone + '</div>';
    	var email = '<div class="email" id="e' + c + '">' + contactList[c].email + '</div>';
    	var contactImg = '<div class="imgdiv" id="i' + c + '"><img class="contactImg" src="images/default.png" /></div>';
    	var contactText = '<div class="contactText" id="t' + c + '">' + name + phone + email + '</div';
    	var typeImg = '<div><img class="typeImg" src="images/wrench.gif"/></div>';

    	$("#c" + c).append(contactImg);
    	$("#c" + c).append(contactText);
    	$("#c" + c).append(typeImg);
    	$("#c" + c).css('top', topLoc + "px");
    	$("#c" + c).css('height', 77 + "px");
    }
}

function filterContacts(){
    var $rows = $('#table');
    $('#inputtext').keyup(function(){
        $("#table").html("");
        var searchText = document.getElementById("inputtext").value.toLowerCase();
        var numEntries = -1;
        for(var c = 0; c < contactList.length; c++){
            if(contactList[c].name.toLowerCase().indexOf(searchText) != -1 || contactList[c].phone.toLowerCase().indexOf(searchText) != -1 || contactList[c].email.toLowerCase().indexOf(searchText) != -1){
                numEntries += 1;
                var contacthtml = '<div class="contact" id="c' + c + '">' + '</div>';
                var topLoc = numEntries*80;
                $("#table").append(contacthtml);
                var name = '<div class="name" id="n' + c + '">' + contactList[c].name + '</div>';
                var phone = '<div class="phone" id="p' + c + '">' + contactList[c].phone + '</div>';
                var email = '<div class="email" id="e' + c + '">' + contactList[c].email + '</div>';
                var contactImg = '<div class="imgdiv" id="i' + c + '"><img class="contactImg" src="images/default.png" /></div>';
                var contactText = '<div class="contactText" id="t' + c + '">' + name + phone + email + '</div';
                var typeImg = '<div><img class="typeImg" src="images/wrench.gif"/></div>';

                $("#c" + c).append(contactImg);
                $("#c" + c).append(contactText);
                $("#c" + c).append(typeImg);
                $("#c" + c).css('top', topLoc + "px");
                $("#c" + c).css('height', 77 + "px");
            }
        }
    });
}

function filterJobs(){
    var $rows = $('.job-group');
    $('#jobsearch').keyup(function(){
        $(".job-group").html("");
        var searchText = document.getElementById("jobsearch").value.toLowerCase();
        var numEntries = -1;
        for(var j = 0; j < jobList.length; j++){
            if(jobList[j].contains(searchText)){
                numEntries += 1;
                addJob(jobList[j]);
            }
        }
    });
}

