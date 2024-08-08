let table = null

function afterSubmit (response) {
    $('#formModal').modal('toggle')
    $.info(response.data.message)
    if(table != null && table.ajax != undefined) {
        table.ajax.reload(null, false)
    }
}

functions.push(function () {
    let csrfValue = $('[name*="csrf"]:first').val();
    let csrfName = $('[name*="csrf"]:first').attr("name")
    let btnAct = _btnActionString();

    table = $('#datatable_content').DataTable({
        'paging': true, // Table pagination
        'ordering': true, // Column ordering
        'info': true, // Bottom left status text
        'responsive': true, // https://datatables.net/extensions/responsive/examples/
        'processing': true,
        'serverSide': true,
        ajax: {
            url: "/cms/setting/role_list",
            type: "POST",
            data: function (d) {
                d[csrfName] = csrfValue
            }
        },
        "columns": [
            {
                "data": "id",
                "title": "id",
                "visible": false,
                "width": '10%'
            }, {
                "data": "name",
                "title": "Name",
                "width": '35%'
            }, {
                "data": "status",
                "title": "Status",
                "width": '30%'
            }, {
                "data": null,
                "defaultContent": btnAct,
                "title": "Action",
                "visible": (btnAct) ? true : false,                
                "width": '15%',
                "sortable": false
            }
        ],
        "order": [[0, "asc"]],
        "dom": '<"toolbar">lfrtip'
    });

    $('.datatable_act tbody').on('click', '.btn-act', function (e) {
        e.preventDefault();
        let actType = $(this).attr('act-type')
        let currentRow = $(this).parents('tr')
        let currentRowData = table.row(currentRow)
        let dataRow = currentRowData.data()
        if (actType == "del") {
            $.confirm("Are you sure that you want to delete this item?",()=>{
                let data = {
                    id:dataRow.id
                }
                data[csrfName] = csrfValue

                $.ajax(
                    {
                        type: "delete",
                        url: "/cms/setting/role_list/destroy/" + dataRow.id,
                        data: data,
                        success: function (data) {
                            if (data.error.code === undefined) {
                                $.info("Your item was successfully deleted!")
                                table.ajax.reload(null, false)
                                return
                            } 
                            if(data.error.code==403){
                                confirmReload()
                                return
                            }
                            $.alert(data.error.message)
                        },
                        error: function (dt) {
                            console.log(data.error.message)
                            confirmReload()
                        }
                    }
                )
            })
        } else if (actType == "edit-modal") {
            let modalTitle = $('#formModal').find('.modal-title')
            let title = modalTitle.attr('data-title')
            let role_id = $('#formModal').find('#role_id')
            let nameInput = $('#formModal').find('#name')
            let statusInput = $('#formModal').find('#status')
            let actUrl = $(this).attr('act-url')
            $('#formModal').find('form').attr('action', actUrl)
            modalTitle.html('Edit ' + title)
            role_id.val(dataRow.id)
            nameInput.val(dataRow.name.trim());
            statusInput.val(dataRow.status);

            $('#formModal').modal({
                backdrop: 'static',
                keyboard: false
            });
        }
    });

    if(_action_lookup.add){
        $("div.toolbar").html('<button title="Add New" class="btn btn-wknd btn-sm btn-add" act-url="/cms/setting/role_list/manage"><span class="icon-span-filestyle fa fa-plus icon-text-l"></span><span>Add New</span></button>');
    }

    $('.btn-add').click(function () {
        let modalTitle = $('#formModal').find('.modal-title');
        let title = modalTitle.attr('data-title');
        let textfield = $('#formModal').find('input:not([id*="csrf"])');
        let statusInput = $('#formModal').find('#status')
        let actUrl = $(this).attr('act-url');
        $('#formModal').find('form').attr('action', actUrl);
        modalTitle.html('Add ' + title);
        textfield.val('')
        statusInput.val('Published');
        $('#formModal').modal({
            backdrop: 'static',
            keyboard: false
        });
    });
});

function _btnActionString(){
    let btnGroup = `<div class="btn-group">
        <button data-toggle="dropdown" class="btn btn-default">Action<b class="caret icon-text-r"></b></button>
        <ul role="menu" class="dropdown-menu dropdown-menu-r">
        </ul>
    </div>`;

    let editUrl = "/cms/setting/role_list/manage"
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