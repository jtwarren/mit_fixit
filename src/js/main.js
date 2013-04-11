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

