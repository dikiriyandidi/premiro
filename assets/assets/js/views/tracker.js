let table = null

function afterSubmit(response) {
    $('#formModal').modal('toggle')
    $.info(response.data.message)
    if (table != null && table.ajax != undefined) {
        table.ajax.reload(null, false)
    }
}

functions.push(function () {
    table = $('#datatable_content').DataTable({
        'paging': true, // Table pagination
        'ordering': true, // Column ordering
        'info': true, // Bottom left status text
        'responsive': false, // https://datatables.net/extensions/responsive/examples/
        'processing': true,
        'serverSide': true,
        ajax: {
            url: "/cms/tracker/",
            type: "POST",
            data: function (d) {
                d.umild_csrf = $("[name='umild_csrf']").val()
            }
        },
        "columns": [{
                "data": "id",
                "title": "id",
                "visible": false,
                "width": '5%'
            },
            {
                "data": "token_id",
                "title": "Token Id",
                "width": '5%'
            },
            {
                "data": "tracker_name",
                "title": "Tracker Name",
                "width": '10%'
            },
            {
                "data": "tracker_data",
                "title": "Tracker Data",
                "width": '10%'
            },
            {
                "data": "createdate",
                "title": "Create Date",
                "width": '20%'
            },


        ],
        "order": [
            [4, "desc"]
        ],
        "dom": '<"toolbar">lfrtip'
    });
    

    $("#reload-table").click(function () {
        $("#reload-table").prop("disabled", true)
        if (table != null && table.ajax != undefined) {
            table.ajax.reload(null, false)
        }

        setTimeout(
            function () {
                $("#reload-table").prop("disabled", false)
            }, 10000);
    })
});