let on_change = false
function afterSubmit(response) {
    $.info(response.data.message, () => {
        window.location = `/cms/setting/user_access/${response.data.roleId}`
    });
}

var checkboxTable = function (table) {
    $(table).on('click', 'tr', function (e) {
        let targetClick = $(e.target)
        let parentTd = targetClick.parents("td:first");

        if(
            parentTd.index()>1 
            || (e.target.tagName =="TD" && targetClick.index()>1)
            ){
            return
        }

        var chkbox = $(this).find('input[name=menu]')
        chkbox.prop("checked", !chkbox.prop("checked"))

        toggleAccess(chkbox)

        var selectMethod = $(".js-selector-toggle.btn-wknd").attr("data-select")

        if(selectMethod == 'child') {
            checkChild($(this), chkbox.is(':checked'))
        }

    })
}

var checkChild = function (el, state, parent_id) {
    var id = el.attr('data-id')
    var children = el.siblings('[data-parentid=' + id + ']')
    $(children).each(function () {
        checkChild($(this), state, id)
    })

    var el_chkbox = el.find('.check_access')
    el_chkbox.prop("checked", state)
    toggleAccess(el_chkbox)
}

var toggleAccess = function(chkbox) {
    var id = chkbox.prop('value')
    if(chkbox.is(':checked')) {
        $('[name*="type_'+id+'"][value="view"]').prop("checked",true)
    } else {
        uncheckAttributeAction(id)
    }
}

functions.push(function () {
    let csrfValue = $('[name*="csrf"]:first').val();
    let csrfName = $('[name*="csrf"]:first').attr("name")

    $("#role_selector").change(function (e) {
        var val = $(this).val();
        $("#table_user_access > tbody tr:not(.js-required__role-selected)").removeClass("hidden")
        $(".js-required__role-selected").addClass("hidden")
        if (val == null || val == "") {
            $("#table_user_access > tbody > tr:not(.js-required__role-selected)").addClass("hidden")
            $(".js-required__role-selected").removeClass("hidden")
            return
        }
        on_change = true;
        uncheckAttributeAction()
        uncheckAccess()
        
        if (on_change) {
            let postData = {
                role_id: val
            }
            postData[csrfName] = csrfValue
            $.postAjax(
                '/cms/setting/user_access/get_user_access_by_role_id', postData,
                function (data) {
                    //restore condition to default first
                    $('.check_access').attr('checked', false);
                    $('.check_access').prop('checked', false);

                    $('#table_user_access').find('tbody tr').removeClass('active')
                    for (var i in data.data.data) {
                        var obj = data.data.data[i];
                        checkAttributeAction(obj.id,obj)
                        $('.check_access[value=' + obj.id + ']').attr('checked', true);
                        $('.check_access[value=' + obj.id + ']').prop('checked', true);
                        if (obj.is_home) {
                            $('#home_id').val(obj.id);
                            $('.check_access[value=' + obj.id + ']').parents('tr').addClass('active')
                        }
                    }
                    validationSaveBtn()
                }
            );
        }
    });

    validationSaveBtn()
    $(document).on('click', ".btn_set_home", function (e) {
        e.preventDefault();
        var id = $(this).data('id');
        $('#table_user_access').find('tbody tr').removeClass('active')
        $(this).parents('tr').addClass('active')
        // $('.home').hide();
        // $('.home[data-id=' + id + ']').show();
        $('.check_access[value=' + id + ']').attr('checked', true);
        $('.check_access[value=' + id + ']').prop('checked', true);
        $('.check_access[value=' + id + ']').trigger('change');
        $('#home_id').val(id);
    });
    
    $(document).on('load', () => {
        $.onLoading()
    })

    $(document).on("click", ".js-selector-toggle", function () {
        $(".js-selector-toggle").removeClass("btn-wknd").addClass("btn-default")
        $(this).addClass("btn-wknd").removeClass("btn-default")
    })
    checkboxTable('#table_user_access');

    $('#form_user_access').submit(function() {
        $('[name*="type_"][value="view"]').prop("disabled",false)
    })
});

var validationSaveBtn = () => {
    let currentRole = $("#role_selector").val()

    $('#fsubmit').removeClass("btn-wknd").addClass("btn-default").prop("disabled", true)
    if (currentRole) {
        $('#fsubmit').addClass("btn-wknd").removeClass("btn-default").prop("disabled", false)
    }
}

function checkAttributeAction(menu_id,data_row){
    let data_action = (data_row.actions) ? data_row.actions : [];
    data_action.map(function(action_type){
        action_type = (action_type) ? action_type : "-"
        // action_type = action_type.charAt(0).toUpperCase()+action_type.substr(1).toLowerCase();

        $action_checkbox = $('[name="type_'+menu_id+'"][value="'+action_type+'"]')
        $action_checkbox.prop("checked",true)
    })
}

function uncheckAttributeAction(menu_id = null){
    let action_menus = ["view","add","edit","delete","export"]
    if(menu_id) {
        action_menus.map(function(action_type){
            $('[name*="type_'+menu_id+'"][value="'+action_type+'"]').prop("checked",false)
        })
    } else {
        action_menus.map(function(action_type){
            $('[name*="type_"][value="'+action_type+'"]').prop("checked",false)
        })
    }
}

function uncheckAccess(){
    $('.check_access').prop('checked',false);
}