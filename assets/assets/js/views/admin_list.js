var table = null
var _usernameCollection = []

function afterSubmit(response){
    $('#formModal').modal('toggle')
    $.info(response.data.message)
    if(table != null && table.ajax != undefined)
        table.ajax.reload(null, false)    
}

functions.push(function () {
    let csrfValue = $('[name*="csrf"]:first').val();
    let csrfName = $('[name*="csrf"]:first').attr("name")

    // $('#role').select2();

    var btnAct = _btnActionString()

    table = $('#admin_list_datatable').DataTable({
        'paging': true,  // Table pagination
        'ordering': true,  // Column ordering
        'info': true,  // Bottom left status text
        'responsive': true, // https://datatables.net/extensions/responsive/examples/
        'processing': true,
        'serverSide': true,
        ajax: {
            url: "/cms/setting/admin_list/get",
            type: "POST",
            data: function(d){
                d[csrfName] = csrfValue
            }
        },
        "columns": [
            {
                "data": "id",
                "title": "id",
                "visible": false,
                "width": '10%'
            },
            {
                "data": "role",
                "title": "Role",
                "width": '10%'
            },
            {
                "data": "username",
                "title": "Username",
                "width": '10%'
            },
            {
                "data": "fullname",
                "title": "Fullname",
                "width": '10%'
            },
            {
                "data": "status",
                "title": "status",
                "width": '10%'
            },        	
            {
                "data": null,
                "defaultContent": btnAct,
                "title": "Action",
                "width": '15%',
                "sortable": false
            }
        ],
        "order": [[0, "asc"]],
        "dom": '<"toolbar">lfrtip'
    });

    $('.datatable_act tbody').on('click', '.btn-act', function (e) {
        e.preventDefault();
        var actType = $(this).attr('act-type');
        var colField = $(this).attr('col-field');
        var currentRow = $(this).parents('tr');
        var currentRowData = table.row(currentRow);
        var dataRow = currentRowData.data();
        getUserEmail()
        //[Aswin 2020-10-08]: since there is no delete API, remove delete button.
        // if (actType == "del") {
        //     swal({
        //         title: "Are you sure?",
        //         text: "Are you sure that you want to delete this item?",
        //         type: "warning",
        //         showCancelButton: true,
        //         closeOnConfirm: false,
        //         confirmButtonText: "Yes, delete it!",
        //         confirmButtonColor: "#ec6c62"
        //     }, function () {
        //         let postData  = {
        //             admin_id:dataRow.id,
        //         }
        //         postData[csrfName] = csrfValue

        //         $.postAjax('/cms/setting/admin_list/delete',postData,
        //                 function(response)
        //                 {
        //                     data = 1;
        //                     if (data) {
        //                         swal({
        //                             title: "Deleted!",
        //                             text: "Your item was successfully deleted!",
        //                             type: "success"
        //                         }, function () {
        //                             // Reload Table
        //                             table.ajax.reload(null, false)
        //                         });
        //                     } else {
        //                         swal("Oops", "An error has occurred!", "error");
        //                     }
        //                 }, 
        //                 function(response){
        //                     swal("Oops", "An error has occurred!", "error");
        //                 }
        //         );
        //     });
        // } else
        if (actType == "edit-modal") {
            var modalTitle = $('#formModal').find('.modal-title');
            var title = modalTitle.attr('data-title');
            var textfield = $('#formModal').find('input');
            var admin_id = $('#formModal').find('#admin_id');
            var roleInput = $('#formModal').find('#role');
            var emailInput = $('#formModal').find('#email');
            var fullnameInput = $('#formModal').find('#fullname');
            var passwordInput = $('#formModal').find('#password');
            var statusInput = $('#formModal').find('#status');
            var actUrl = $(this).attr('act-url');
            roleInput.val('');
            $('#formModal').find('form').attr('action', actUrl);
            modalTitle.html('Edit ' + title);
            admin_id.val(dataRow.id);

            roleInput.find('[class="selected"]').remove();
            roleInput.find('[class="hidden"]').removeClass('hidden');

            $("#role option[value='" + dataRow.role_ids + "']").prop("selected", true);
            
            $("#role").trigger('change');
            emailInput.val(dataRow.username).trigger("keyup").trigger("keyup");
            fullnameInput.val(dataRow.fullname).trigger("keyup");
            statusInput.val(dataRow.status).trigger("change")
            passwordInput.val("").trigger("keyup")
            validateBtnSubmit()
            
            $('#formModal').modal({
                backdrop: 'static',
                keyboard: false
            });
        }
    });
    
    if(_action_lookup.add){
        $("div.toolbar").html('<button title="Add New" class="btn btn-wknd btn-sm btn-add" act-url="/cms/setting/admin_list/add_edit"><span class="icon-span-filestyle fa fa-plus icon-text-l"></span><span>Add New</span></button>');
    }

    $('.btn-add').click(function () {
        var modalTitle = $('#formModal').find('.modal-title');
        var title = modalTitle.attr('data-title');
        var textfield = $('#formModal').find('input:not([id*="csrf"])');
        var roleInput = $('#formModal').find('#role');
        // var actUrl = $(this).attr('act-url');
        
        // $('#formModal').find('form').attr('action', actUrl);
        modalTitle.html('Add ' + title);
        textfield.val('');
        $("#admin_id").val("0");
        roleInput.val('').trigger('change');
        
        getUserEmail()
        $("#email").val("").trigger("keyup")
        $("#password").val("").trigger("keyup")
        
        $('#formModal').modal({
            backdrop: 'static',
            keyboard: false
        });
    });

    $(".js-pass-list").addClass("hidden")
    $('.js-pass-ref').keyup(function(){
            var Value = this.value;
            condition(/^.{8,30}$/, 0);
            condition(/(?=.*?[0-9]{1})/, 1);
            condition(/(?=.*?[A-Z]{1})(?=.*?[a-z]{1})/, 2);
            condition(/(?=.*?[^a-zA-Z0-9]{1})/, 3);
            let editAdmin = $("#admin_id").val()
            if(Value=="" && editAdmin>0){
                $(".js-pass-list").addClass("hidden isValid")
                return
            }
            if(Value=="" && editAdmin==0){
                $(".js-pass-list").addClass("hidden").removeClass("isValid")
            }

            function condition(reg, nth) {
                var li = $('.js-pass-list li');
                if(reg.test(Value)){
                        li.eq(nth).attr('data-passed',true)
                } else {
                        li.eq(nth).attr('data-passed',false)
                }

                $(".js-pass-list").removeClass("hidden isValid")
                if(li.filter('[data-passed="false"]').length==0){
                    $(".js-pass-list").addClass("hidden isValid")
                }
            }
    });

    // $(".js-pass-ref").on("focusin",()=>{
    //     $(".js-pass-list").removeClass("hidden")
    // })

    $('#email').keyup(function(){
        var Value = this.value;
        var regexEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        let editAdmin = $("#admin_id").val()
        let isUsedEmail = _usernameCollection.indexOf(Value)
        let isValidEmail = regexEmail.test(Value)

        $(this).removeClass("email-input-valid")
        $(".js-email-validation").removeClass("hidden isValid")
            .addClass("isNotValid").html("Email format invalid")
        if(Value==""){
            $(".js-email-validation").addClass("hidden")
        }

        if(isUsedEmail>-1 && editAdmin!=isUsedEmail ){
            $(".js-email-validation").removeClass("hidden isValid").addClass("isNotValid").html("Email is used")
            return
        }
        
        if(isValidEmail && Value!=""){
            $(this).addClass("email-input-valid")
            $(".js-email-validation").removeClass("hidden isNotValid")
                .addClass("isValid").html("")
        }
    });

    
    // $("#email").on("focusin",()=>{
    //     $(".js-email-validation").removeClass("hidden")
    // })
    
    $("#fullname").keyup(function(){
        var Value = this.value;
        var regexSpecialChar = /[!"#$%&'()*+.,\/:;<=>?@\[\\\]^_`{|}~-]/;
        // var regexDigit = /\d/;
        $(this).removeClass("name-input-valid")
        $(".js-name-validation").removeClass("hidden isValid")
            .addClass("isNotValid").html("Fullname can contain alphabet, number and space only")
        if(Value==""){
            $(".js-name-validation").addClass("hidden")
        }else if( Value.search(regexSpecialChar)==-1 ){
            $(this).addClass("name-input-valid")
            $(".js-name-validation").removeClass("hidden isNotValid")
                .addClass("isValid").html("")
        }
    })

    // $("#fullname").on("focusin",()=>{
    //     $(".js-name-validation").removeClass("hidden")
    // })

    $(function(){
        validateBtnSubmit()
        $("#fullname,#email,#password").on("blur keyup",()=>{
            validateBtnSubmit()
        })
    })

    var validateBtnSubmit = ()=>{
        total=3
        if($(".js-email-validation").hasClass("isValid"))
            total--
        if($(".js-pass-list").hasClass("isValid"))
            total--
        if($(".js-name-validation").hasClass("isValid"))
            total--

        $("#fsubmit").attr("disabled","disabled").addClass("btn-default").removeClass("btn-wknd")
        if(total==0){
            $("#fsubmit").removeAttr("disabled").removeClass("btn-default").addClass("btn-wknd")
        }
    }

    var getUserEmail = ()=>{
        $('.datatable_act tbody > tr').each(function(i,row){
            let currentRow = $(row)
            let currentRowData = table.row(currentRow)
                rowData = currentRowData.data()
            _usernameCollection[rowData.id] = rowData.username
        })
        return _usernameCollection
    }
});

function _btnActionString(){
    let btnGroup = `<div class="btn-group">
        <button data-toggle="dropdown" class="btn btn-default">Action<b class="caret icon-text-r"></b></button>
        <ul role="menu" class="dropdown-menu dropdown-menu-r">
        </ul>
    </div>`;

    let editUrl = "/cms/setting/admin_list/add_edit"
    let btnEdit = (!_action_lookup.edit) ? "" : `<li><a href="#" class="btn-act" act-type="edit-modal" params="id" act-url="`+editUrl+`"><em class="fa fa-pencil icon-text-l"></em>Edit</a></li>`;
    // let btnDelete = (!_action_lookup.delete) ? "" :  `<li><a href="#" class="btn-act" act-type="del"><em class="fa fa-trash-o icon-text-l"></em>Delete</a>`;
    let btnActionCollection = [
        // btnDelete,
        btnEdit
    ].filter(row=>row!="")

    let $htmlDropdown = $(btnGroup)
        .find(".dropdown-menu.dropdown-menu-r")

        btnActionCollection.map(function(row){
            $htmlDropdown = $htmlDropdown.append(row)
        })
        $htmlDropdown = $htmlDropdown.end()

    return (btnActionCollection.length) ? $htmlDropdown[0].outerHTML : ""
}