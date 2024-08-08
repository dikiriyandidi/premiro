let table = null

functions.push(function () {
    let btnAct = _btnActionString();

    table = $('#datatable_content').DataTable({
        'paging': true, // Table pagination
        'ordering': true, // Column ordering
        'info': true, // Bottom left status text
        'responsive': true, // https://datatables.net/extensions/responsive/examples/
        'processing': true,
        'serverSide': true,
        ajax: {
            url: "/cms/event/event_list",
            type: "POST",
            data: function (d) {
                d.wknd_csrf = $("[name='wknd_csrf']").val()
            }
        },
        "columns": [
            {
                "data": "id",
                "title": "id",
                "visible": false,
                "width": '10%'
            }, {
                "data": "string_id",
                "title": "string_id",
                "visible": false,
                "width": '10%'
            }, {
                "data": "title",
                "title": "Title",
                "width": '20%'
            }, {
                "data": "city",
                "title": "City",
                "width": '20%'
            }, {
                "data": "startdate",
                "title": "Start Date",
                "width": '15%'
            }, {
                "data": "enddate",
                "title": "End Date",
                "width": '15%'
            }, {
                "data": "featured_image",
                "title": "Featured Image",
                "width": '15%',
                "sortable": false
            }, {
                "data": "status",
                "title": "Status",
                "width": '15%'
            }, {
                "data": null,
                "defaultContent": btnAct,
                "title": "Action",
                "visible": (btnAct) ? true : false,
                "width": '10%',
                "sortable": false
            }
        ],
        "order": [[0, "desc"]],
        "dom": '<"toolbar">lfrtip'
    });

    $('.datatable_act tbody').on('click', '.btn-act', function (e) {
        e.preventDefault();
        let actType = $(this).attr('act-type')
        let currentRow = $(this).parents('tr')
        let currentRowData = table.row(currentRow)
        let dataRow = currentRowData.data()
        if (actType == "del") {
            swal({
                title: "Are you sure?",
                text: "Are you sure that you want to delete this item?",
                type: "warning",
                showCancelButton: true,
                closeOnConfirm: false,
                confirmButtonText: "Yes, delete it!",
                confirmButtonColor: "#ec6c62"
            }, function () {
                $.ajax(
                    {
                        type: "delete",
                        url: "/cms/event/event_list/destroy/" + dataRow.id,
                        data: {wknd_csrf:$("[name='wknd_csrf']").val()},
                        success: function (data) {
                            if (data.error.code === undefined) {
                                swal({
                                    title: "Deleted!",
                                    text: "Your item was successfully deleted!",
                                    type: "success"
                                }, function () {
                                    // Reload Table
                                    // table.fnReloadAjax();
                                    table.ajax.reload(null, false)
                                });
                            } else {
                                swal("Oops", "An error has occurred!", "error");
                            }
                        },
                        error: function () {
                            swal("Oops", "An error has occurred!", "error");
                        }
                    }
                )
            });
        } else if (actType == "edit-modal") {
            let actUrl = $(this).attr('act-url') + dataRow.string_id
            $( location ).attr("href", actUrl);
        }
    });

    if(_action_lookup.add){
        $("div.toolbar").html('<button title="Add New" class="btn btn-wknd btn-sm btn-add"><span class="icon-span-filestyle fa fa-plus icon-text-l"></span><span>Add New</span></button>');
    }

    $('.btn-add').click(function () {
        let url = $("#datatable_content").attr('form-url');
        window.location.href = base_path + url;
    });
});

function _btnActionString(){
    let btnGroup = `<div class="btn-group">
        <button data-toggle="dropdown" class="btn btn-default">Action<b class="caret icon-text-r"></b></button>
        <ul role="menu" class="dropdown-menu dropdown-menu-r">
        </ul>
    </div>`;

    let editUrl = "/cms/event/event_list/detail/"
    let btnDelete = (!_action_lookup.edit) ? "" : `<li><a href="#" class="btn-act" act-type="edit-modal" params="id" act-url="`+editUrl+`"><em class="fa fa-pencil icon-text-l"></em>Edit</a></li>`;
    let btnEdit = (!_action_lookup.delete) ? "" :  `<li><a href="#" class="btn-act" act-type="del"><em class="fa fa-trash-o icon-text-l"></em>Delete</a>`;
    let btnActionCollection = [
        btnDelete,btnEdit
    ].filter(row=>row!="")

    let $htmlDropdown = $(btnGroup)
        .find(".dropdown-menu.dropdown-menu-r")

        btnActionCollection.map(function(row){
            $htmlDropdown = $htmlDropdown.append(row)
        })
        $htmlDropdown = $htmlDropdown.end()

    return (btnActionCollection.length) ? $htmlDropdown[0].outerHTML : ""
}