/////////////////////////////////////////////////////////
// Main JS files for loading document. 
/////////////////////////////////////////////////////////

// An array listing all of the jobs.
var jobList = new Array(); 
var workers = new Array();
var contactList = new Array();
var selectedJob = null;
var selectedJobView = null;
var selectedTab = "alltab";
var current_user = new fixit.Person("Michael McIntyre", "michael@mit.edu", "309.269.2032", "images/houseManager.jpg");

$('document').ready(function() {

    /** 
     * Middle Panel 
     */
    var rebecca = new fixit.Person("Rebecca Krosnick", "krosnick@mit.edu", "240.505.2222");
    var anurag = new fixit.Person("Anurag Kashyap", "anurag@mit.edu", "412.961.2424");
    var jeff = new fixit.Person("Jeffrey Warren", "jtwarren@mit.edu", "603.438.6440");
    
    // Mechanics
    var jenks = new fixit.Person("Jenks", "jenks@mit.edu", "617-777-7777", "images/mechanic1.jpg");
    var billy = new fixit.Person("Billy", "billy@mit.edu", "617-777-7778", "images/mechanic2.jpg");
    workers.push(jenks);
    workers.push(billy);
            
    // Populate the jobList with fake jobs.
    var date1 = new Date();
    date1.setHours(date1.getHours() - Math.floor(Math.random()*24));
    date1.setMinutes(date1.getMinutes() - Math.floor(Math.random()*60));
    date1.setSeconds(date1.getSeconds() - Math.floor(Math.random()*60));
    var job1 = new fixit.Job("Broken Lightbulb", "Ran into the lamp because I was rushing. There's shattered glass everywhere. I tried to clean it up a bit but there are probably still little pieces on the ground. Can you come clean up the glass and replace the lightbulb? It's really dark in here and I enjoy studying here, so if you could come as soon as possible that would be great", 
        "McCormick East Penthouse", date1, jeff); 
    job1.setStatus("assigned");
    job1.setWorker(billy);


    var date2 = new Date();
    date2.setHours(date2.getHours() - Math.floor(Math.random()*24));
    date2.setMinutes(date2.getMinutes() - Math.floor(Math.random()*60));
    date2.setSeconds(date2.getSeconds() - Math.floor(Math.random()*60));
    var job2 = new fixit.Job("Door doesn't lock", "The handle turns but I can't press in the button from the inside of the room. I don't feel safe leaving my door unlocked at night, or when I'm gone because my valuables may be stolen. Can you please come fix this asap?",
        "McCormick room 501", date2, anurag); 

    var date3 = new Date();
    date3.setHours(date3.getHours() - Math.floor(Math.random()*24));
    date3.setMinutes(date3.getMinutes() - Math.floor(Math.random()*60));
    date3.setSeconds(date3.getSeconds() - Math.floor(Math.random()*60));
    var job3 = new fixit.Job("Elevator broken", "When I pressed the buttons on the wall none of them light up. I waited a couple minutes but the elevator did not come. I'm guess there's an electrical problem with the buttons. I live on the 6th floor and don't like walking up stairs...please fix this!",
        "McCormick East Tower", date3, rebecca); 

    var date4 = new Date();
    date4.setHours(date4.getHours() - Math.floor(Math.random()*24));
    date4.setMinutes(date4.getMinutes() - Math.floor(Math.random()*60));
    date4.setSeconds(date4.getSeconds() - Math.floor(Math.random()*60));
    var job4 = new fixit.Job("Window screen missing", "Can't leave my window open because there's no screen. The weather is starting to get warmer so I'd really like to open my window. And it also gets muggy in my room if I don't open the window a crack.",
        "McCormick room 210", date4, jeff);
    job4.setWorker(jenks);
    job4.addUpdate(new fixit.Update(jenks, "Screen has been installed", new Date(), false));
    job4.setStatus("completed");

    var date5 = new Date();
    date5.setHours(date5.getHours() - Math.floor(Math.random()*24));
    date5.setMinutes(date5.getMinutes() - Math.floor(Math.random()*60));
    date5.setSeconds(date5.getSeconds() - Math.floor(Math.random()*60));
    var job5 = new fixit.Job("Refrigerator isn't working correctly", "My food is spoiling really quickly. Yogurt that isn't supposed to expire until 2 weeks from now tasted really bad when I tried it yesterday. Same with my milk. This is probably something facilities should check on. It's affecting a lot of students.",
        "McCormick 3rd floor East kitchen", date5, anurag);

    var date6 = new Date();
    date6.setHours(date6.getHours() - Math.floor(Math.random()*24));
    date6.setMinutes(date6.getMinutes() - Math.floor(Math.random()*60));
    date6.setSeconds(date6.getSeconds() - Math.floor(Math.random()*60));
    var job6 = new fixit.Job("Washing machine broken", "Washing machine number 3 is soaking my clothes. Other students have reported this issue as well. It's making me put my clothing in the dryer for multiple cycles instead of the usual 1. For now I just won't use this machine but can you please get this fixed soon?",
        "McCormick basement - laundry room", date6, rebecca);

    jobList.push(job1); 
    jobList.push(job2);
    jobList.push(job3); 
    jobList.push(job4); 
    jobList.push(job5);
    jobList.push(job6);

    jobList.sort(sortByTime);
    
    // Loads the jobs that are currently in the joblist. 
    loadJobs(); 

    // Loads the address book and allow contacts to be filtered. 
    loadAddressBook(); 
    filterContacts();

    filterJobs();
    
    $(".tab-item").click(function(){
        selectedTab = this.id;
        replaceMiddlePanel(this.id);
    });

    /***** 
     * Right Panel 
     */ 
    if (selectedJob === null) {
        $(".description-panel").html('<span class="no-job-panel"> No job selected! </span>'); 
    }

    $(".tab-item").click(function(event) {
        $(".tab-item").removeClass("selected");
        $(this).addClass("selected");
    });

});

function sortByTime(a, b){
    var d = new Date();
    return (d - a.getJobTime()) - (d - b.getJobTime());
}


// Load the jobs in a task list for a particular 
function loadJobs() {
    for (var i=0; i<jobList.length; i++) {
        var currentJob = jobList[i];                      
        addJob(currentJob); 
    }
}

var giveMiddlePanelStarIconClickHandler = function(jobView, jobModel, starIcon) {
    starIcon.click(function(){
        jobModel.toggleStarred();   // update the model
        if (starIcon.hasClass('filled')) {
        // replace star icon w/ empty star
            starIcon.remove();
            var newStarIcon = $('<img class="star" src="images/star-hollow.png"/>');
            giveMiddlePanelStarIconClickHandler(jobView, jobModel, newStarIcon);
            jobView.find('.starred').append(newStarIcon);
        } else {
        // fil out star icon
            starIcon.remove();
            var newStarIcon = $("<img class='star filled' src='images/star_filled2.png' />");
            giveMiddlePanelStarIconClickHandler(jobView, jobModel, newStarIcon);
            jobView.find('.starred').append(newStarIcon);
        }
    });
}

var giveRightPanelStarIconClickHandler = function(jobView, jobModel, starIcon) {
    // console.log(jobView);
    // console.log(starIcon);
    starIcon.click(function(){
        // console.log(jobView);
        // console.log(starIcon);
        jobModel.toggleStarred();   // update the model
        if (starIcon.hasClass('filled')) {
        // replace star icon w/ empty star (in both middle panel & right panel)
            starIcon.remove();
            var newStarIcon = $('<img class="star" src="images/star-hollow.png"/>');
            giveRightPanelStarIconClickHandler(jobView, jobModel, newStarIcon);
            $(".job-buttons").prepend(newStarIcon);

            var starIconMiddlePanel = jobView.find('.star');
            // $(".star").remove();
            starIconMiddlePanel.remove();
            var newStarIconMiddlePanel = $('<img class="star" src="images/star-hollow.png"/>');
            giveMiddlePanelStarIconClickHandler(jobView, jobModel, newStarIconMiddlePanel);
            jobView.find('.starred').append(newStarIconMiddlePanel);

        } else {
        // fil out star icon (in both middle panel & right panel)
            starIcon.remove();
            var newStarIcon = $("<img class='star filled' src='images/star_filled2.png' />");
            giveRightPanelStarIconClickHandler(jobView, jobModel, newStarIcon);
            $(".job-buttons").prepend(newStarIcon);

            var starIconMiddlePanel = jobView.find('.star');
            starIconMiddlePanel.remove();
            var newStarIconMiddlePanel = $("<img class='star filled' src='images/star_filled2.png' />");
            giveMiddlePanelStarIconClickHandler(jobView, jobModel, newStarIconMiddlePanel);
            jobView.find('.starred').append(newStarIconMiddlePanel);
        }
    });
}

var giveRightPanelAssignedClickHandler = function(jobView, jobModel, assignedButton) {
    assignedButton.click(function() {
        $(".job-buttons").find("#mark_completed_button").html("Mark complete");
        jobModel.setStatus("assigned");
        worker = workers[parseInt($(".assigned-mechanic").find(":selected").val())]
        selectedJob.setWorker(worker);
        $(".assigned-mechanic-img").attr('src', selectedJob.getAssignedToPic());
        jobView.prependTo($(".assigned-jobs"));
        jobView.find(".mechanic-image").attr('src', selectedJob.getAssignedToPic());
        jobView.find(".label-area").addClass("assigned-label");
        jobView.find(".label-area").removeClass("unassigned-label");
        jobView.find(".label-area").removeClass("completed-label");
        jobView.find(".label-area").html("assigned");
    });
}

var giveRightPanelCompletedClickHandler = function(jobView, jobModel, completedButton) {
    // A little hacky, leaving for now.
    $(".job-buttons").find("#mark_completed_button").unbind('click');
    completedButton.click(function() {
        if (jobModel.getStatus() === 'completed') {
        // completedButton is a mark incomplete button
            if (jobModel.getWorker() != null) {
            // i.e., job should now be considered 'assigned'
                // jobView.prependTo($(".assigned-jobs"));
                jobModel.setStatus("assigned");
                jobView.find(".label-area").addClass("assigned-label");
                jobView.find(".label-area").removeClass("completed-label");
                jobView.find(".label-area").html("assigned");
            } else {
            // job should be considered unassigned
                // jobView.prependTo($(".unassigned-jobs"));
                jobModel.setStatus("new");
                jobView.find(".label-area").addClass("unassigned-label");
                jobView.find(".label-area").removeClass("completed-label");
                jobView.find(".label-area").html("unassigned");
            }
            completedButton.html("Mark complete");
        } else {
            jobModel.setStatus("completed");
            // jobView.prependTo($(".completed-jobs"));
            completedButton.html("Mark incomplete");
            jobView.find(".label-area").addClass("completed-label");
            jobView.find(".label-area").removeClass("unassigned-label");
            jobView.find(".label-area").removeClass("assigned-label");
            jobView.find(".label-area").html("completed");
        }
        //console.log(jobModel.getStatus());
        giveRightPanelCompletedClickHandler(jobView, jobModel, completedButton);
        //replaceMiddlePanel(selectedTab);
    });
}

// Load a particular job.
function addJob(currentJob) {
    var jobContext = '<div class="job"> \
        <div class="starred"> <img class="star" src="images/star-hollow.png"/> </div> \
        <div> <img class="mechanic-image" src="';
//images/star_filled2.png
    if(currentJob.isStarred()){
        jobContext = '<div class="job"> \
        <div class="starred"> <img class="star filled" src="images/star_filled2.png"> </div> \
        <div> <img class="mechanic-image" src="';
    }
        
    jobContext += currentJob.getAssignedToPic(); 
    jobContext += '" style="width:50px;" /> </div> \
                <div class="job-description-text"> \
                <div class="job-display-text">'
                
    jobContext += currentJob.getTitle().substring(0, 50);
    jobContext += '</div> <span class="blurb-location">'
    jobContext += currentJob.getLocation();

    // Label
    var labeltext = currentJob.getStatus();
    if(labeltext === "new"){
        labeltext = "unassigned";
    }
    var labelHTML = '<div class="' + labeltext + '-label label-area">' + labeltext + '</div>';

    jobContext += '</span>';
    jobContext += labelHTML;
    jobContext += ' <div class="blurb-time"> ';

    // Depending on whether or not the date change is within the day. 
    var currentTime = new Date();    
    if ((currentJob.getJobTime()-currentTime)/1000/60/60/24 < 1) {
        jobContext += currentJob.getJobTime().toLocaleTimeString(); 
    } else {
        jobContext += currentJob.getJobTime().toLocaleDateString(); 
    }
    jobContext += '</div>';
    jobContext += ' </div></div> ';
    
    var job = $(jobContext);
    if(selectedJob === currentJob){
        // console.log("selectedJob === currentJob");
        job.addClass("focus");
        selectedJobView = job;
    }
    $(job).click(function() {
        selectedJob = currentJob;
        selectedJobView = job;
        $(".job-panel .job-group .job").removeClass("focus");
        job.addClass("focus");
        replaceDetails(currentJob, job);
    });

    var starIconMiddlePanel = job.find('.star');
    giveMiddlePanelStarIconClickHandler(job, currentJob, starIconMiddlePanel);

    $(".jobs").append(job);
    // console.log("job is being appended to thing of class .jobs");
    // if (currentJob.getStatus() == "unassigned" || 
    //     currentJob.getStatus() == "new") {
    //     $(".unassigned-jobs").append(job);
    // } else if (currentJob.getStatus() == "assigned") {
    //     $(".assigned-jobs").append(job);
    // } else if (currentJob.getStatus() == "completed") {
    //     $(".completed-jobs").append(job);  
    // } else {
    //     // Job should not have a different status.
    //     // there is a problem with this job. 
    //     console.log('current status is invalid');
    // }            
}

// Replace the details for a given job
function replaceDetails(job, jobView) {
    // console.log("replaceDetails() is being called.");

    var rightPanelHTML = '<div class="description shadow"> \
                       <span class="job-title"> \
                            <span></span> \
                        </span> \
                        <span class="job-buttons"> \
                            <img class="star" src="images/star-hollow.png"/>\
                            <button id="mark_completed_button" class="btn btn-custom">Mark completed</button> \
                        </span> \
                        <div class="job-location"> \
                        </div> \
                        <div class="job-description"> \
                        </div> \
                        <div class="job-reporter"> \
                        </div> \
                    </div> \
                    <div class="assignment shadow"> \
                        <!--<h4>Assignment</h4>--> \
                        <span> \
                            <img class="assigned-mechanic-img" style="width:50px" src="images/default.png"/> \
                            <select class="assigned-mechanic"> \
                            </select> \
                            <button id="assign-button" type="submit" class="btn btn-custom"><b>Assign</b></button> \
                        </span> \
                    </div> \
                    <div class="panel-updates shadow"> \
                        <div class="updates"> \
                            <!--<h4>Updates</h4>-->  \
                            <div class="update"> \
                                <div> \
                                    <img class="update-image" style="width:50px" src="images/default.png"/> \
                                </div> \
                                <div class="update-text"> \
                                </div> \
                            </div> \
                        </div> \
                    <div class="update-form"> \
                        <textarea id="update-textarea" class="input input-block-level" placeholder="Type an update..."/></textarea> \
                        <button id="update-button" type="submit" class="btn btn-custom"><b>Submit</b></button> \
                        <span class="help-inline">Tip: Press tab and then enter to submit an update.</span> \
                    </div> \
                    </div>'; 
    var currentElement = document.getElementsByClassName("description-panel")[0];
    currentElement.innerHTML = rightPanelHTML; 
    $(".description-panel .description .job-title span").html(job.getTitle());
    $(".description-panel .description .job-location").html(job.getLocation());
    $(".description-panel .description .job-description").html(job.getText());
    var reporter = job.getReporter();
    $(".description-panel .description .job-reporter").html(reporter.getName() + ", " + reporter.getEmail() + ", " + reporter.getPhone());

    for (var i = 0; i < workers.length; i++) {

        if (job.getWorker() && job.getWorker().getName() === workers[i].getName()) {
            $(".assigned-mechanic").append($('<option selected="selected" value=' + i + '>' + workers[i].getName() + '</option>'));
            $(".assigned-mechanic-img").attr('src', job.getAssignedToPic());
        } else {
            $(".assigned-mechanic").append($('<option value=' + i + '>' + workers[i].getName() + '</option>'));
        }
    };

    
    
    $(".updates").empty();
    // $(".updates").append($('<h4>Updates</h4>'))

    $.each(job.getUpdateList(), function(index, update) {
        var $update = $('<div class="update"/>');
        var $img = $('<div><img class="update-image" style="width:50px;"'
            +'src="'+ update.getUpdater().getPicture() +'"/></div>');
        var $updateText = $('<div class="update-text"/>');
        $updateText.append($('<span class="username">' + update.getUpdater().getName() + " " + '</span>'));
        $updateText.append(update.getText());
        $updateText.append($('<div class="time">' + update.getTime() + '</div>'));

        $update.append($img);
        $update.append($updateText);
        $(".updates").append($update);
    });

    if (job.isStarred()) {
        $(".job-buttons").find(".star").remove();
        $(".job-buttons").prepend($("<img class='star filled' src='images/star_filled2.png' />"));
    } else {
        $(".job-buttons").find(".star").remove();
        $(".job-buttons").prepend($('<img class="star" src="images/star-hollow.png"/>'));
    }

    var starIconRightPanel = $(".job-buttons").find(".star");
    giveRightPanelStarIconClickHandler(jobView, job, starIconRightPanel);

    var completedButton = $(".job-buttons").find("#mark_completed_button");
    if (job.getStatus() === 'completed') {
        completedButton.html("Mark incomplete");
    } else {
        completedButton.html("Mark complete");
    }
    giveRightPanelCompletedClickHandler(jobView, job, completedButton);

    var assignButton = $("#assign-button");
    giveRightPanelAssignedClickHandler(jobView, job, assignButton);
    
    buttonListeners(); 
}

function replaceMiddlePanel(tab) {
    // console.log("replaceMiddlePanel() is being called.");
    // console.log("replaceMiddlePanel() is being called.");
    // var allMiddlePanelHTML = '<h4> Unassigned Jobs </h4> \
    //                 <div class="unassigned-jobs job-group">  \
    //                 </div> \
    //                 <h4> Assigned Jobs </h4> \
    //                 <div class="assigned-jobs job-group"> \
    //                 </div> \
    //                 <h4> Completed Jobs </h4> \
    //                 <div class="completed-jobs job-group"> \
    //                 </div> ';
    // console.log("replaceMiddlePanel() is being called.");
    //var allMiddlePanelHTML = "<h4 class='jobs-heading'> Jobs </h4> \
    var headingName;
    if(selectedTab === "alltab"){
        headingName = "All Jobs";
    }else if(selectedTab === "unassignedtab"){
        headingName = "Unassigned Jobs";
    }else if(selectedTab === "assignedtab"){
        headingName = "Assigned Jobs";
    }else if(selectedTab === "completedtab"){
        headingName = "Completed Jobs";
    }else if(selectedTab === "starredtab"){
        headingName = "Starred Jobs";
    }

    var allMiddlePanelHTML = "<h4 class='jobs-heading'>" + headingName +
                    "</h4> \
                    <div class='jobs job-group'> \
                    </div>";
    //$(".job-group").html("");
    $(".panel.job-panel").html("");
    //$(".job-group").html("");
    //console.log(tab);
    var searchText = document.getElementById("jobsearch").value.toLowerCase();
    console.log(searchText);
    if(tab === "alltab"){
        // console.log("alltab");
        $(".panel.job-panel").html(allMiddlePanelHTML);
        for (var i=0; i<jobList.length; i++) {
            var currentJob = jobList[i];
            if(currentJob.contains(searchText)){
                addJob(currentJob);
            }
        }
    } else {
        if(tab === "starredtab"){
            $(".panel.job-panel").html(allMiddlePanelHTML);
            for (var i=0; i<jobList.length; i++) {
                var currentJob = jobList[i];
                if(currentJob.isStarred() && currentJob.contains(searchText)){
                    addJob(currentJob);
                }
            }
            if(selectedJob != null && selectedJob.isStarred() == false){
                selectedJob = null;
                selectedJobView = null;
            }
        }else{
            $(".panel.job-panel").html(allMiddlePanelHTML);
            // $(".panel.job-panel").html("");
            if(tab === "unassignedtab"){
                // $(".panel.job-panel").html('<h4> Unassigned Jobs </h4> \
                        // <div class="unassigned-jobs job-group">  \
                        // </div>');
                for (var i=0; i<jobList.length; i++) {
                    var currentJob = jobList[i];
                    if(currentJob.getStatus() === "new" && currentJob.contains(searchText)){
                        addJob(currentJob);
                    } 
                }
                if(selectedJob != null && selectedJob.getStatus() != "new"){
                    selectedJob = null;
                    selectedJobView = null;
                }
            }else if(tab === "assignedtab"){
                // $(".panel.job-panel").html('<h4> Assigned Jobs </h4> \
                //         <div class="assigned-jobs job-group">  \
                //         </div>');
                for (var i=0; i<jobList.length; i++) {
                    var currentJob = jobList[i];
                    if(currentJob.getStatus() === "assigned" && currentJob.contains(searchText)){
                        addJob(currentJob);
                    } 
                }
                if(selectedJob != null && selectedJob.getStatus() != "assigned"){
                    selectedJob = null;
                    selectedJobView = null;
                }
            }else if(tab === "completedtab"){
                // $(".panel.job-panel").html('<h4> Completed Jobs </h4> \
                //         <div class="completed-jobs job-group">  \
                //         </div>');
                for (var i=0; i<jobList.length; i++) {
                    var currentJob = jobList[i];
                    if(currentJob.getStatus() === "completed" && currentJob.contains(searchText)){
                        addJob(currentJob);
                    } 
                }
                if(selectedJob != null && selectedJob.getStatus() != "completed"){
                    selectedJob = null;
                    selectedJobView = null;
                }
            }
        }
    }
    if (selectedJob === null) {
        $(".description-panel").html('<span class="no-job-panel"> No job selected! </span>'); 
    } else {
        replaceDetails(selectedJob, selectedJobView);
    }/*else{
 Fixed starring bug (where after selecting a tab and then clicking the right panel star caused nothing to happen)
            var jobContext = '<div class="job"> \
                    <div class="starred"> <i class="star"></i> </div> \
                    <div> <img class="mechanic-image" src="'
        
            jobContext += selectedJob.getAssignedToPic(); 
            jobContext += '" style="width:50px;" /> </div> \
                    <div class="job-description-text"> \
                    <div class="job-display-text">'
                
            jobContext += selectedJob.getTitle().substring(0, 50);
            jobContext += '</div> <span class="blurb-location">'
            jobContext += selectedJob.getLocation(); 
            jobContext += '</span> <div class="blurb-time"> '
            jobContext += selectedJob.getJobTime().toLocaleString(); 
            jobContext += '</div> </div></div> ';
    
            var job = $(jobContext);
            $(".job-panel .job-group .job").removeClass("focus");
            job.addClass("focus");
            //console.log();
        }*/
}


// Load Address book component. 
function loadAddressBook() {
    //data model
    var alan = new Contact("Alan Michelson", "617-584-2094", "michelson@mit.edu", "images/mechanic4.jpg");
    var becky = new Contact("Becky Folds", "617-543-1352", "beks@mit.edu", "images/mechanic5.jpg");
    var billy = new Contact("Billy", "617-777-7778", "billy@mit.edu", "images/mechanic2.jpg");
    var homeDepot = new Contact("Home Depot", "617-940-0184", "contact@homedepot.com", "images/homedepot.jpg");
    var jenks = new Contact("Jenks Jenkinson", "617-239-8971", "jenks@mit.edu","images/mechanic1.jpg");

    contactList.push(alan);
    contactList.push(becky);
    contactList.push(billy); 
    contactList.push(homeDepot);
    contactList.push(jenks);

    for(var c = 0; c < contactList.length; c++){
    	var contacthtml = '<div class="contact" id="c' + c + '">' + '</div>';
    	var topLoc = c*80;
    	$("#table").append(contacthtml);
    	var contact = contactList[c];
    	var name = '<div class="name" id="n' + c + '">' + contact.name + '</div>';
    	var phone = '<div class="phone" id="p' + c + '">' + contact.phone + '</div>';
    	var email = '<div class="email" id="e' + c + '">' + contact.email + '</div>';
    	var contactImg = '<div class="imgdiv" id="i' + c + '"><img class="contactImg" src="'+
    	    contact.getPicture() + '"/></div>';
    	var contactText = '<div class="contactText" id="t' + c + '">' + name + phone + email + '</div';
    	//var typeImg = '<div><img class="typeImg" src="images/wrench.gif"/></div>';

    	$("#c" + c).append(contactImg);
    	$("#c" + c).append(contactText);
    	//$("#c" + c).append(typeImg);
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
                var contact = contactList[c];
                var name = '<div class="name" id="n' + c + '">' + contact.name + '</div>';
                var phone = '<div class="phone" id="p' + c + '">' + contact.phone + '</div>';
                var email = '<div class="email" id="e' + c + '">' + contact.email + '</div>';
                var contactImg = '<div class="imgdiv" id="i' + c + '"><img class="contactImg" src="' +
                    contact.getPicture() + '" /></div>';
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
    // console.log("filterJobs() is being called.");
    var $rows = $('.job-group');
    $('#jobsearch').keyup(function(){
        $(".job-group").html("");
        var searchText = document.getElementById("jobsearch").value.toLowerCase();
        var numEntries = -1;
        for(var j = 0; j < jobList.length; j++){
            if(selectedTab === "alltab"){
                if(jobList[j].contains(searchText)){
                    numEntries += 1;
                    addJob(jobList[j]);
                }
            }else if(selectedTab === "starredtab"){
                if(jobList[j].isStarred() && jobList[j].contains(searchText)){
                    numEntries += 1;
                    addJob(jobList[j]);
                }
            }else if(selectedTab === "unassignedtab"){
                if(jobList[j].getStatus() === "new" && jobList[j].contains(searchText)){
                    numEntries += 1;
                    addJob(jobList[j]);
                }
            }else if(selectedTab === "assignedtab"){
                if(jobList[j].getStatus() === "assigned" && jobList[j].contains(searchText)){
                    numEntries += 1;
                    addJob(jobList[j]);
                }
            }else if(selectedTab === "completedtab"){
                if(jobList[j].getStatus() === "completed" && jobList[j].contains(searchText)){
                    numEntries += 1;
                    addJob(jobList[j]);
                }
            }
        }
        if(selectedJob != null){
            if(!selectedJob.contains(searchText)){
                $(".description-panel").html('<span class="no-job-panel"> No job selected! </span>');
            }else{
                replaceDetails(selectedJob, selectedJobView);
            }
        }
    });
}


// Listens to the click effects to assign and update buttons.
function buttonListeners() {

    $('#update-button').click(function() {
        var content = $(".update-form .input");
        var $update = $('<div class="update"/>');
        var $img = $('<div><img class="update-image" style="width:50px; height:50px;"'
            +'src="'+ current_user.getPicture() +'"/></div>');
        var $updateText = $('<div class="update-text"/>');
        $updateText.append($('<span class="username">Michael McIntyre </span>'));
        $updateText.append(content.val());
        $updateText.append($('<div class="time">' + new Date() + '</div>'));

        $update.append($img);
        $update.append($updateText);
        $(".updates").append($update);
        $(".updates").scrollTop($(".updates")[0].scrollHeight);

        up = new fixit.Update(current_user, content.val(), new Date(), "urgency");
        selectedJob.addUpdate(up);
        selectedJob.setJobTime(new Date());
        jobList.sort(sortByTime);
        replaceMiddlePanel(selectedTab);
        content.val("");
        $("#update-textarea").focus();
        return false;
    });
}

