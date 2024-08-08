let table = null

functions.push(function () {
    let btnAct = '<div class="btn-group">' +
        '<button data-toggle="dropdown" class="btn btn-default">Action<b class="caret icon-text-r"></b>' +
        '</button>' +
        '<ul role="menu" class="dropdown-menu dropdown-menu-r">' +
        '<li><a href="#" class="btn-act" act-type="edit-modal" params="id" act-url="/cms/voucher/detail/"><em class="fa fa-pencil icon-text-l"></em>View voucher Detail</a>' +
        '</li>' +
        '<li><a href="#" class="btn-act" act-type="del"><em class="fa fa-trash-o icon-text-l"></em>Delete</a>' +
        '</li>' +
        '</ul>' +
        '</div>';

    table = $('#datatable_content').DataTable({
        'paging': true, // Table pagination
        'ordering': true, // Column ordering
        'info': true, // Bottom left status text
        'responsive': true, // https://datatables.net/extensions/responsive/examples/
        'processing': true,
        'serverSide': true,
        ajax: {
            url: "/cms/voucher/detail",
            type: "POST",
            data: function (d) {
                d.wknd_csrf = $("[name='wknd_csrf']").val(),
                d.id = $("#id").val()
            }
        },
        "columns": [
            {
                "data": "id",
                "title": "id",
                "visible": false,
                "width": '10%'
            }, {
                "data": "voucher_name",
                "title": "Voucher Name",
                "width": '10%'
            }, 
            {
                "data": "voucher_code",
                "title": "Voucher Code",
                "width": '20%'
            },
            {
                "data": "used_date",
                "title": "Used Date",
                "width": '20%'
            }, 
            {
                "data": "used_by",
                "title": "Used By",
                "width": '20%'
            },
        ],
        "order": [[0, "desc"]],
        "dom": '<"toolbar">lfrtip'
    });
});