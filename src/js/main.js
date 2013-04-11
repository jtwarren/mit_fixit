/////////////////////////////////////////////////////////
// Main JS files for loading document. 
/////////////////////////////////////////////////////////

// An array listing all of the jobs.
var jobList = new Array(); 

$('document').ready(function() {
            
    // Populate the jobList with fake jobs.
    var job1 = new fixit.Job("Broken Lightbulb", "broke light bulb.",
        "East Penthouse", new Date()); 
    var job2 = new fixit.Job("Broken Lightbulb2", "broke light bulb.",
        "East Penthouse", new Date()); 
    var job3 = new fixit.Job("Broken Lightbulb3", "broke light bulb.",
        "East Penthouse", new Date()); 
    var job4 = new fixit.Job("Broken Lightbulb4", "broke light bulb.",
        "East Penthouse", new Date()); 
    jobList.push(job1); 
    jobList.push(job2);
    jobList.push(job3); 
    jobList.push(job4); 
    loadJobs(); 
});


// Load the jobs in a task list for a particular 
function loadJobs() {
    for (var i=0; i<jobList.length; i++) {
        var currentJob = jobList[i];     
        console.log(currentJob);                 
        var jobContext = "";
        if (currentJob.getStatus() == "unassigned" || 
            currentJob.getStatus() == "new") {
                console.log('new task');
              /*  currentJob.append('<div class="job">
                                <div class="starred"> <i class="icon-star"></i> </div>
                                <div class="mechanic-image"> <img src="images/default.png" style="width:50px;" /> </div>
                                <div class="job-description-text"> 
                                    <div class="job-display-text"> Light bulbs smashed in the Mccormick Penthouse. </div>
                                    <span class="blurb-location"> Mccormick East Penthouse </span>
                                    <div class="blurb-time"> 3:45 pm </div>
                                </div>
                            </div>');*/

        } else if (currentJob.getStatus() == "assigned") {
                
        } else if (currentJob.getStatus() == "completed") {
                
        } else {
            // Job should not have a different status.
            // there is a problem with this job. 
            console.log('current status is invalid');
        }
                
            jobContext += "</ul>"
   }
        
}
