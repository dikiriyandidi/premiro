let table = null

functions.push(function () {
    let viewUrl = $('#datatable_content').attr('data-view');
    let btnAct = _btnActionString();

    table = $('#datatable_content').DataTable({
        'paging': true, // Table pagination
        'ordering': true, // Column ordering
        'info': true, // Bottom left status text
        'responsive': true, // https://datatables.net/extensions/responsive/examples/
        'processing': true,
        'serverSide': true,
        ajax: {
            url: "/cms/article",
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
                "render": function (data, type, row, meta) {
                    data = _titleAction({
                        view_url:viewUrl,
                        string_id:row.string_id,
                        label:data
                    })
                    return data;
                },
                "width": '25%'
            },
            {
                "data": "is_highlight",
                "title": "Highlight",
                "width": '10%'
            }, {
                "data": "publishdate",
                "title": "Publish Date",
                "width": '15%'
            }, {
                "data": "view_count",
                "title": "View Count",
                "width": '10%'
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
                        url: "/cms/article/destroy/" + dataRow.id,
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

    let tools = []

    if(_action_lookup.add){
        tools.push('<button title="Add New" class="btn btn-wknd btn-sm btn-add"><span class="icon-span-filestyle fa fa-plus icon-text-l"></span><span>Add New</span></button>')
    }

    if(_action_lookup.export) {
        tools.push('<button title="Export" class="btn btn-wknd btn-sm btn-export active"><span class="icon-span-filestyle fa fa-download icon-text-l"></span><span>Export</span></button>')
    }

    
    $("div.toolbar").html(tools.join(' '))

    $('.btn-add').click(function () {
        let url = $("#datatable_content").attr('form-url');
        window.location.href = base_path + url;
    });

    $('.btn-export').click(function(e) {
        e.preventDefault();
        export_data()
        return
    })

    function export_data() {
        $.onLoading()
        $.ajax({
            url: "/cms/article/export",
            data: {wknd_csrf:$("[name='wknd_csrf']").val()},
            type: 'POST',
            // processData: false,
            // contentType: false,
            success: function(data, status, response){
                $.hideLoading()
                let disposition = response.getResponseHeader('content-disposition').split('; ')
                let fileName = disposition[1].replace('filename=','').replaceAll("\"","")
                
                const blob = new Blob([data], {type: "application/octet-stream"})
                const url = window.URL.createObjectURL(blob)

                var a = document.createElement('A');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }, error: function(e) {
                $.hideLoading()
                $.alert(e.responseJSON.error.message)
            }
        });
    }
});

function _btnActionString(){
    let btnGroup = `<div class="btn-group">
        <button data-toggle="dropdown" class="btn btn-default">Action<b class="caret icon-text-r"></b></button>
        <ul role="menu" class="dropdown-menu dropdown-menu-r">
        </ul>
    </div>`;

    let editUrl = "/cms/article/detail/"
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

function _titleAction(option){
    let viewUrl = (option && option.view_url) ? option.view_url : ""
    let string_id = (option && option.string_id) ? option.string_id : ""
    let label = (option && option.label) ? option.label : "";
    
    let titleAction = `<a href="` + viewUrl + string_id + `"><em class="fa fa-search click-area"></em> &nbsp;` + label + `</a>`;
    return (_action_lookup.edit) ? titleAction : label
}