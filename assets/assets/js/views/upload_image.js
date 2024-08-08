let table = null

function afterSubmit (response) {
    $('#formModal').modal('toggle')
    $.info(response.data.message)
    if(table != null && table.ajax != undefined) {
        table.ajax.reload(null, false)
    }
}

functions.push(function () {
    let btnAct = '<div class="btn-group">' +
        '<button data-toggle="dropdown" class="btn btn-default">Action<b class="caret icon-text-r"></b>' +
        '</button>' +
        '<ul role="menu" class="dropdown-menu dropdown-menu-r">' +
        '<li><a href="#" class="btn-act" act-type="edit-modal" params="id" act-url="/cms/interest/manage"><em class="fa fa-pencil icon-text-l"></em>Edit</a>' +
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
            url: "/cms/upload_image",
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
            },{
                "data": "url",
                "title": "Url",
                "sortable": false,
                "render": function (data, type, row, meta) {
                    data = data;
                    return data;
                },
                "width": '20%'
            },
            {
                "data": "url",
                "title": "Thumbnail",
                "sortable": false,
                "render": function (data, type, row, meta) {
                    data = '<img src="' + data + '" width="200px"/>'
                    return data;
                },
                "width": '20%'
            },
            {
                "data": "created_date",
                "title": "Created Date",
                "sortable": false,
                "width": '20%'
            },
        ],
        "order": [[2, "desc"]],
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
                        type: "post",
                        url: "/cms/interest/destroy",
                        data: {wknd_csrf:$("[name='wknd_csrf']").val(), id:dataRow.id},
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
            let modalTitle = $('#formModal').find('.modal-title')
            let title = modalTitle.attr('data-title')
            let idInput = $('#formModal').find('#id')
            let image = $('#formModal').find('#image')
            let status = $('#formModal').find('#status')
            let actUrl = $(this).attr('act-url')
            $('#formModal').find('form').attr('action', actUrl)
            modalTitle.html('Edit ' + title)
            idInput.val(dataRow.id)
            image.html('')

            if(dataRow.image_on != '') {
                image_on_th.html('<a href="' + dataRow.image_on + '" title="click to enlarge" target="_blank"><img src="' + dataRow.image_on + '" width="50px" /></a>')
            }
            if(dataRow.image_off != '') {
                image_off_th.html('<a href="' + dataRow.image_off + '" title="click to enlarge" target="_blank"><img src="' + dataRow.image_off + '" width="50px" /></a>')
            }

            $('#formModal').modal({
                backdrop: 'static',
                keyboard: false
            });
        }
    });

    if(_action_lookup.add){
        $("div.toolbar").html('<button title="Add New" class="btn btn-wknd btn-sm btn-add" act-url="/cms/upload_image/manage_image"><span class="icon-span-filestyle fa fa-plus icon-text-l"></span><span>Add New</span></button>');
    }

    $('.btn-add').click(function () {
        let modalTitle = $('#formModal').find('.modal-title')
        let title = modalTitle.attr('data-title')
        let textfield = $('#formModal').find('input:not(#wknd_csrf)')
        let image = $("[name='image']");
        let actUrl = $(this).attr('act-url');
        let image_label = $('#formModal').find('#image_label')
        $('#formModal').find('form').attr('action', actUrl);
        modalTitle.html('Add ' + title);
        textfield.val('')
        image.html('')
        image_label.html('Choose a file')
        $('#formModal').modal({
            backdrop: 'static',
            keyboard: false
        });
    });
});