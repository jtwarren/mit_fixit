/////////////////////////////////////////////////////////
// Main JS files for loading document. 
/////////////////////////////////////////////////////////

// An array listing all of the jobs.
var jobList = new Array(); 
var contactList = new Array();
var selectedJob = null;

$('document').ready(function() {
    var rebecca = new fixit.Person("Rebecca Krosnick", "krosnick@mit.edu", "240.505.2222");
    var anurag = new fixit.Person("Anurag Kashyap", "anurag@mit.edu", "858.442.3774");
    var jeff = new fixit.Person("Jeffrey Warren", "jtwarren@mit.edu", "603.438.6440");
            
    // Populate the jobList with fake jobs.
    var job1 = new fixit.Job("Broken Lightbulb", "Ran into the lamp because I was rushing. There's shattered glass everywhere. I tried to clean it up a bit but there are probably still little pieces on the ground. Can you come clean up the glass and replace the lightbulb? It's really dark in here and I enjoy studying here, so if you could come as soon as possible that would be great", 
        "McCormick East Penthouse", new Date(), jeff); 
    job1.setStatus("assigned");
    job1.setWorker("Bob");

    var job2 = new fixit.Job("Door doesn't lock", "The handle turns but I can't press in the button from the inside of the room. I don't feel safe leaving my door unlocked at night, or when I'm gone because my valuables may be stolen. Can you please come fix this asap?",
        "McCormick room 501", new Date(), anurag); 

    var job3 = new fixit.Job("Elevator broken", "When I pressed the buttons on the wall none of them light up. I waited a couple minutes but the elevator did not come. I'm guess there's an electrical problem with the buttons. I live on the 6th floor and don't like walking up stairs...please fix this!",
        "McCormick East Tower", new Date(), rebecca); 

    var job4 = new fixit.Job("Window screen missing", "Can't leave my window open because there's no screen. The weather is starting to get warmer so I'd really like to open my window. And it also gets muggy in my room if I don't open the window a crack.",
<<<<<<< HEAD
        "McCormick room 210", new Date());
    var jenks = new fixit.Person("Jenks", "jenks@mit.edu", "617-777-7777")
    job4.setWorker(jenks);
    job4.addUpdate(new fixit.Update(jenks, "Screen has been installed", new Date(), false));
=======
        "McCormick room 210", new Date(), jeff);
    job4.setWorker("Jenks");
    job4.addUpdate(new fixit.Update("Jenks", "Screen has been installed", new Date(), false));
>>>>>>> 75aaa2ab30812aeef51ebd31cdbe073263edfd3c
    job4.setStatus("completed");

    var job5 = new fixit.Job("Refrigerator isn't working correctly", "My food is spoiling really quickly. Yogurt that isn't supposed to expire until 2 weeks from now tasted really bad when I tried it yesterday. Same with my milk. This is probably something facilities should check on. It's affecting a lot of students.",
        "McCormick 3rd floor East kitchen", new Date(), anurag);

    var job6 = new fixit.Job("Washing machine broken", "Washing machine number 3 is soaking my clothes. Other students have reported this issue as well. It's making me put my clothing in the dryer for multiple cycles instead of the usual 1. For now I just won't use this machine but can you please get this fixed soon?",
        "McCormick basement - laundry room", new Date(), rebecca);

    jobList.push(job1); 
    jobList.push(job2);
    jobList.push(job3); 
    jobList.push(job4); 
    jobList.push(job5);
    jobList.push(job6);
    
    // Loads the jobs that are currently in the joblist. 
    loadJobs(); 
    
    // Makes each of the job clickable and will then trigger the right panel to update.
    $(".job").click(function (i) {
       console.log("clicked on this");  
    }); 

    // Loads the address book and allow contacts to be filtered. 
    loadAddressBook(); 
    filterContacts();

    filterJobs();
    
    // Assign the mechanic to the particular job. 
    $("#assign-button").click(function(event) {
        console.log($("#assigned-mechanic option:selected").text());

    $('#update-button').click(function() { 
        var content = $(".update-form .input");
        console.log(content.val());
    });
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
        selectedJob = currentJob;
        $(".job-panel .job-group .job").removeClass("focus");
        job.addClass("focus");
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
    var reporter = job.getReporter();
    $(".description-panel .description .job-reporter").html(reporter.getName() + ", " + reporter.getEmail() + ", " + reporter.getPhone());

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

