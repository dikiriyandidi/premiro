functions.push(function () {
    $('#fsubmit').on('click', function (e) {
        e.preventDefault();
        var tracker_name = $("#tracker_name").val();
        var startdate = $("#startdate").val();
        var enddate = $("#enddate").val();
        
        if(!tracker_name || tracker_name == undefined || tracker_name == ""){
            swal("Oops", "Tracker name required!", "error");
        }
        else if(startdate > enddate){
            swal("Oops", "Start Date cannot be greater than End Date!", "error");
        }
        else if(!startdate){
            swal("Oops", "Startdate required!", "error");
        }
        else if(!enddate){
            swal("Oops", "Enddate required!", "error");
        }
        else{
            window.location.href = `/cms/tracker/export/${encodeURIComponent(tracker_name)}/${startdate}/${enddate}`
        }
    })
})