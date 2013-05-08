/////////////////////////////////////////////////////////
// Main JS files for loading document.
/////////////////////////////////////////////////////////

// An array listing all of the jobs.
var jobList = new Array(); 
var workers = new Array();
var students = new Array();
var contactList = new Array();
var selectedJob = null;
var selectedJobView = null;
var selectedTab = "alltab";
var current_user = new fixit.Person("Michael McIntyre", "michael@mit.edu", "309-269-2032", "images/houseManager.jpg");
var labelTypes = new Array();

$('document').ready(function() {

    var firebase = new Firebase("https://mit-fixit.firebaseio.com/");


    // Add students to the database
    var studentsRef = new Firebase("https://mit-fixit.firebaseio.com/users/students");
    studentsRef.on('child_added', function(snapshot) {
        var student = snapshot.val();
        students.push(new fixit.Person(student.name, student.email, student.phone))
    });

    // Add workers to the database
    var mechanicsRef = new Firebase("https://mit-fixit.firebaseio.com/users/mechanics");
    mechanicsRef.on('child_added', function(snapshot) {
        var mechanic = snapshot.val();
        workers.push(new fixit.Person(mechanic.name, mechanic.email, mechanic.phone, mechanic.picture, mechanic.id))
    });


    // var rebecca = new fixit.Person("Rebecca Krosnick", "krosnick@mit.edu", "240.505.2222");
    // var anurag = new fixit.Person("Anurag Kashyap", "anurag@mit.edu", "412.961.2424");
    // var jeff = new fixit.Person("Jeffrey Warren", "jtwarren@mit.edu", "603.438.6440");

    
    // Add jobs to the database
    var jobsRef = new Firebase("https://mit-fixit.firebaseio.com/jobs");
    jobsRef.on('child_added', function(snapshot) {
        var job = snapshot.val();
        var reporter;
        var dataRef = new Firebase('https://mit-fixit.firebaseio.com/users/students/' + job.reporter);
        dataRef.on('value', function(snapshot) {
            student = snapshot.val()
            reporter = new fixit.Person(student.name, student.email, student.phone)
        });
        currentJob = new fixit.Job(job.title, job.text, job.location, job.time, reporter, job.status, job.assigned, job.starred);
        currentJob.setJobRef(snapshot.ref());

        var updates = snapshot.child("/updates");

        updates.forEach(function(childSnapshot) {
            update = childSnapshot.val();
            var dataRef = new Firebase('https://mit-fixit.firebaseio.com/users/mechanics/' + update.user);
                dataRef.on('value', function(snapshot) {
                    user = snapshot.val()
                    nUser = new fixit.Person(user.name, user.email, user.phone, user.picture, user.id)
                });
            var up = new fixit.Update(nUser, update.text, update.time);
            up.setUpdateRef(childSnapshot.ref());
            currentJob.addUpdate(up, false);
        });

        // addJob(currentJob);
        jobList.push(currentJob);

        jobList.sort(sortByTime);
        replaceMiddlePanel(selectedTab);
    });

    


    // Loads the address book and allow contacts to be filtered. 
    loadAddressBook(); 
    filterContacts();

    filterJobs();
    
    // Deals with Tabbing on the left. 
    $(".tab-item").click(function(){
        selectedTab = this.id;
        replaceMiddlePanel(this.id);
        if(selectedJob === null){
            $(".add-label-to-job").html("");
        }else{
            $(".add-label-to-job").html("<form action='' class='labelform'> \
                                    <select id ='labeldropdown' name='labellist' multiple='multiple'> \
                                    </select> \
                                </form>");
            //<option value='selectlabels'>Select labels</option> \
            /* $("#labeldropdown").multiselect({
             //   header: false
           // }); */
        }
        updateLabelDropDown();
    });

    // $('#create-job-form').on('submit', function(event) {

    //     var jobsRef = new Firebase("https://mit-fixit.firebaseio.com/jobs");

    //     var location = $("#inputLocation").val();
    //     var title = $("#inputTitle").val();
    //     var desc = $("#inputDescription").val();

    //     var jobRef = jobsRef.push({"location" : location, "title" : title, "text" : desc, "time" : (new Date()).getTime(), "reporter" : "michael", "status" : "new"});

    //     jobRef.setPriority(1/(new Date()).getTime());

    //     $("#inputLocation").val("");
    //     $("#inputTitle").val("");
    //     $("#inputDescription").val("");

    //     $('#createJobModal').modal('hide');
    // });


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

    $("#add-btn").click(function(event){
        var name = document.getElementById("create-label-text").value;
        document.getElementById("create-label-text").value = "";
        $("#myLabelCreator").hide();
        $(".modal-backdrop").hide();
        labelTypes.push(name);
        addNewLabel(name);
    });

    /***** 
     * Right Panel 
     */ 
    if (selectedJob === null) {
        $(".description-panel").html('<span class="no-job-panel"> No job selected! </span>'); 
    }

    //$("#labeldropdown").multiselect();

});

/**
 * Adds a new label on the left panel. 
 */
function addNewLabel(labelName){
    var leftPanelHTML = "";
    labelTypes.sort();
    for(var i = 0; i < labelTypes.length; i++){
        var name = labelTypes[i];
        leftPanelHTML += '<li class="tab-item" id="' + labelTypes[i] + 'tab"><a href="#' + name + '">' + name + '</a></li>';
    }
    $("#label-list").html(leftPanelHTML);
    

    if(selectedJob === null){
        $(".add-label-to-job").html("");
    }else{
        $(".add-label-to-job").html("<form action='' class='labelform'> \
                    <select id ='labeldropdown' name='labellist' multiple='multiple'> \
                    </select> \
                    </form>");
            /*$("#labeldropdown").multiselect({
                header: false
            });*/
        updateLabelDropDown();
    }

    $(".tab-item").click(function(event) {
        $(".tab-item").removeClass("selected");
        $(this).addClass("selected");
    });

    $(".tab-item").click(function(){
        selectedTab = this.id;
        replaceMiddlePanel(this.id);
        if(selectedJob === null){
            $(".add-label-to-job").html("");
        }else{
            $(".add-label-to-job").html("<form action='' class='labelform'> \
                                    <select id ='labeldropdown' name='labellist' multiple='multiple'> \
                                    </select> \
                                </form>");
            /*$("#labeldropdown").multiselect({
                header: false
            });*/
            updateLabelDropDown();
        }
        //updateLabelDropDown();
    });
    /*var labelHTML = '<option value="selectlabels">Select labels</option>';
    for(var i = 0; i < labelTypes.length; i++){
        var name = labelTypes[i];
        labelHTML += '<option value="' + name.toLowerCase() + '">' + name + '</option>';
    }
    $(".labeldropdown").html(labelHTML);*/
    
}

function sortByTime(a, b){
    var d = new Date();
    return (d - a.getJobTime()) - (d - b.getJobTime());
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
    starIcon.click(function(){
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
        console.log($(".assigned-mechanic").find(":selected").val());
        if (parseInt($(".assigned-mechanic").find(":selected").val()) >= 0) {
            worker = workers[parseInt($(".assigned-mechanic").find(":selected").val())]
            selectedJob.setWorker(worker);
            $(".assigned-mechanic-img").attr('src', selectedJob.getAssignedToPic());
            jobView.prependTo($(".assigned-jobs"));
            jobView.find(".mechanic-image").attr('src', selectedJob.getAssignedToPic());
            jobView.find(".label-area").addClass("assigned-label");
            jobView.find(".label-area").removeClass("unassigned-label");
            jobView.find(".label-area").removeClass("completed-label");
            jobView.find(".label-area").html("assigned");
            console.log("hiding"); 
            $(".assigned-mechanic-name").text(selectedJob.getWorker().getName());
            $(".assigned-mechanic").hide(); 
            $("#assign-button").hide(); 
            $("#reassign-button").show(); 
            $("#reassign-button").click(function() {
                alert("I WANT TO REASSIGN");
            }); 
        } else {
            alert("Unassigning mechanic"); 
        }
        
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
        giveRightPanelCompletedClickHandler(jobView, jobModel, completedButton);
        //replaceMiddlePanel(selectedTab);
    });
}

// Load a particular job.
function addJob(currentJob) {
    var jobContext = '<div class="job"> \
        <div class="starred"> <img class="star" src="images/star-hollow.png"/> </div> \
        <div> <img class="mechanic-image" src="';

    // console.log(currentJob.isStarred());
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
    // console.log(currentJob.getJobTime());
    jobContext += ' <div class="blurb-time"> ' + $.timeago(parseInt(currentJob.getJobTime())) + '</div>';

    // Depending on whether or not the date change is within the day. 
    // var currentTime = new Date();    
    // if ((currentJob.getJobTime()-currentTime)/1000/60/60/24 < 1) {
    //     jobContext += currentJob.getJobTime().toLocaleTimeString(); 
    // } else {
    //     jobContext += currentJob.getJobTime().toLocaleDateString(); 
    // }

    jobContext += '</div>';
    jobContext += ' </div></div> ';
    
    var job = $(jobContext);
    if(selectedJob === currentJob){
        job.addClass("focus");
        selectedJobView = job;
    }
    $(job).click(function() {
        var jobAlreadySelected = false;
        //console.log(selectedJob);
        if(selectedJob != null){
            jobAlreadySelected = true;
        }
        selectedJob = currentJob;
        selectedJobView = job;
        $(".job-panel .job-group .job").removeClass("focus");
        job.addClass("focus");
        replaceDetails(currentJob, job);
        //if(!jobAlreadySelected){
            //console.log("add html");
            //console.log($(".add-label-to-job"));
            //$(".add-label-to-job").html("text");
            $(".add-label-to-job").html("<form action='' class='labelform'> \
                                    <select id ='labeldropdown' name='labellist' multiple='multiple'> \
                                    </select> \
                                </form>");
            /*$("#labeldropdown").multiselect({
                header: false
            });*/

            //console.log($(".add-label-to-job"));
        //}
        $(".add-label-to-job").html("<form action='' class='labelform'> \
                                    <select id ='labeldropdown' name='labellist' multiple='multiple'> \
                                    </select> \
                                </form>");
        updateLabelDropDown();
    });

    var starIconMiddlePanel = job.find('.star');
    giveMiddlePanelStarIconClickHandler(job, currentJob, starIconMiddlePanel);


    $(".jobs").append(job);
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

function updateLabelDropDown(){
    /*var labelHTML = '<option value="selectlabels">Select labels</option>';
    var selectedJobLabels = selectedJob.getLabels();
    for(var i = 0; i < selectedJobLabels; i++){
        var name = selectedJobLabels[i];
        labelHTML += '<option value="' + name.toLowerCase() + '">' + name + '</option>';
    }
    $(".labeldropdown").html(labelHTML);*/
    var labelHTML = "";
    if(selectedJob != null){
        for(var i = 0; i < labelTypes.length; i++){
            var name = labelTypes[i];
            labelHTML += '<option value="' + name.toLowerCase() + '">' + name + '</option>';
        }
        $("#labeldropdown").html(labelHTML);
        $("#labeldropdown").multiselect({
            header: false,
            noneSelectedText: "Labels applied",
            selectedText: "Labels applied"
        });
    }
}

function checkboxesChangedUpdateLabels(){

}

// Replace the details for a given job
function replaceDetails(job, jobView) {

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
                            <div class="currently-assigned-text"> Currently Assigned: </div> \
                            <img class="assigned-mechanic-img" style="width:50px" src="images/default.png"/> \
                            <div class="assigned-mechanic-name"> No one.</div>\
                            <select class="assigned-mechanic"> \
                            </select> \
                            <button id="assign-button" type="submit" class="btn btn-custom"><b>Assign</b></button> \
                            <button id="reassign-button" type="submit" class="btn btn-custom" style="display: none"> \
                                <b>Reassign</b> \
                            </button> \
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

    if (!job.getWorker()) {
        $(".assigned-mechanic").append('<option selected="selected" value=""> Select a mechanic. </option>');
        for (var i = 0; i < workers.length; i++) {
            if (job.getWorker() && job.getWorker().getName() === workers[i].getName()) {
                $(".assigned-mechanic").append($('<option selected="selected" value=' + i + '>' + workers[i].getName() + '</option>'));
                $(".assigned-mechanic-img").attr('src', job.getAssignedToPic());
            } else {
                $(".assigned-mechanic").append($('<option value=' + i + '>' + workers[i].getName() + '</option>'));
            }
        };
    } else {
        $(".assigned-mechanic-img").attr('src', job.getAssignedToPic());
        $(".assigned-mechanic-name").text(job.getWorker().getName());
        $(".assigned-mechanic").hide(); 
        $("#assign-button").hide(); 
        $("#reassign-button").show(); 
        $("#reassign-button").click(function() {
            alert("I WANT TO REASSIGN");
        }); 
    }
    

    
    
    $(".updates").empty();
    // $(".updates").append($('<h4>Updates</h4>'))

    var updateDivIsWhite = true;
    if (job.getUpdateList().length === 0) {
        $('.updates').after($('<span id="no-updates-msg">No updates to be displayed!</span>'));
    }
    $.each(job.getUpdateList(), function(index, update) {
        var $update = $('<div class="update"/>');
        if (updateDivIsWhite) {
            $update.addClass("white_update");
        } else {
            $update.addClass("gray_update");
        }
        updateDivIsWhite = !(updateDivIsWhite);
        var $img = $('<div><img class="update-image" style="width:50px;"'
            +'src="'+ update.getUpdater().getPicture() +'"/></div>');
        var $updateText = $('<div class="update-text"/>');
        $updateText.append($('<span class="username">' + update.getUpdater().getName() + " " + '</span>'));
        if (update.getUpdater().getName() === 'Michael McIntyre') {
            var delete_update_button = $('<span><a href="#" class="delete-update-button">x</a></span>');
            delete_update_button.click(function() {
                update.deleteSelf();
                $img.remove();
                $updateText.remove();
                selectedJob.getUpdateList().splice(index, 1);
            })
            $updateText.append(delete_update_button);
        }
        $updateText.append($('<div>'+update.getText()+'</div>'));
        //console.log(update.getTime());
        $updateText.append($('<div class="time">' + $.timeago(update.getTime()) + '<hr class="update_rule" /></div>'));

        $update.append($img);
        $update.append($updateText);
        $(".updates").append($update);
        $(".updates").scrollTop(999999999);
        // $(".updates").scrollTop($('.updates').height());
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
    }else{
        headingName = selectedTab.substring(0, selectedTab.length-3) + " Jobs";
    }
    $("#jobsearch").attr("placeholder", "Search " + headingName);


    var allMiddlePanelHTML = "<div class='topbar'> \
                        <span> \
                            <span class='jobs-heading'>";
    allMiddlePanelHTML += headingName;
    allMiddlePanelHTML += "</span> \
                            <span class='add-job'> \
                                <a role='button' class='btn btn-create btn-custom' data-target='#createJobModal' data-toggle='modal'> + </a> \
                                <div id='createJobModal' class='modal hide fade' tabindex='-1' role='dialog'> \
                                    <div class='modal-header'> \
                                        <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button> \
                                        <h3> Create Job </h3> \
                                    </div>  \
                                    <div class='modal-body'> \
                                        <form class='form-horizontal' id='create-job-form'> \
                                            <div class='control-group'> \
                                                <label class='control-label' for='inputLocation'>Location</label> \
                                                <div class='controls'> \
                                                    <input type='text' id='inputLocation' placeholder='McCormick - Room 501' required> \
                                                </div> \
                                            </div> \
                                            <div class='control-group'> \
                                                <label class='control-label' for='inputTitle'>Title</label> \
                                                <div class='controls'> \
                                                    <input type='text' id='inputTitle' placeholder='Title' required> \
                                                </div> \
                                            </div> \
                                            <div class='control-group'> \
                                                <label class='control-label' for='inputDescription'>Description</label> \
                                                <div class='controls'> \
                                                    <textarea type='text' id='inputDescription' placeholder='Description' rows='7' required></textarea> \
                                                </div> \
                                            </div> \
                                            <div> \
                                                <button id='create-job-close-btn' type='button' data-dismiss='modal' class='btn'>Cancel</button> \
                                                <button id='create-job' type='submit' class='btn btn-custom'>Create Job</button> \
                                            </div> \
                                        </form> \
                                    </div> \
                                </div> \
                            </span> \
                            <span class='add-label-to-job'> \
                            </span> \
                        </span> \
                    </div> \
                    <!-- main middle panel --> \
                    <div class='jobs job-group'> \
                    </div>";
    //$(".job-group").html("");
    $(".panel.job-panel").html("");
    //$(".job-group").html("");
    //console.log(tab);
    var searchText = document.getElementById("jobsearch").value.toLowerCase();
    //console.log(searchText);
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
            }else{
                for (var i=0; i<jobList.length; i++) {
                    var currentJob = jobList[i];
                    if(currentJob.getLabels().indexOf(selectedTab.substring(0, selectedTab.length-3)) != -1 && currentJob.contains(searchText)){
                        addJob(currentJob);
                    } 
                }
            }
        }
    }

    if ($(".job").length === 0) {
    // no jobs being displayed in middle panel, put message saying "No jobs to
    // display"
        $(".job-group").append($('<span class="no-job-panel no-job-middle-panel">No jobs to be displayed!</span>'));
    }

    if (selectedJob === null) {
        $(".description-panel").html('<span class="no-job-panel"> No job selected! </span>');
        $(".add-label-to-job").html("");
    } else {
        replaceDetails(selectedJob, selectedJobView);
    }

    addCreateListener();

    $(function () { $("input,select,textarea").not("[type=submit]").jqBootstrapValidation(); } );

    updateLabelDropDown();


}

var addCreateListener = function() {
    $('#create-job-form').on('submit', function(event) {

        var jobsRef = new Firebase("https://mit-fixit.firebaseio.com/jobs");

        var location = $("#inputLocation").val();
        var title = $("#inputTitle").val();
        var desc = $("#inputDescription").val();

        var jobRef = jobsRef.push({"location" : location, "title" : title, "text" : desc, "time" : (new Date()).getTime(), "reporter" : "michael", "status" : "new"});

        jobRef.setPriority(1/(new Date()).getTime());

        $("#inputLocation").val("");
        $("#inputTitle").val("");
        $("#inputDescription").val("");

        $('.modal.in').modal('hide');
    });
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
        $updateText.append($('<div class="time">' + new Date() + '</div><hr />'));

        $update.append($img);
        $update.append($updateText);
        $(".updates").append($update);
        $(".updates").scrollTop(999999999);
        // $(".updates").scrollTop($('.updates').height());
        // $(".updates").scrollTop($(".updates")[0].scrollHeight);

        var up = new fixit.Update(current_user, content.val(), new Date(), "urgency");
        var ur = selectedJob.addUpdate(up, true);
        up.setUpdateRef(ur);
        selectedJob.setJobTime((new Date()).getTime());
        jobList.sort(sortByTime);
        replaceMiddlePanel(selectedTab);
        content.val("");
        $("#update-textarea").focus();
        return false;
    });
}

// Get the corresponding worker 

