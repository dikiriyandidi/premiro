
functions.push(function(){
    $('.btn-add__menu,.btn-action.edit').click(function (e) {
        // console.log("create and edit menu")
        let $modal = $("#formModal")
        let $btnCaller = $(e.currentTarget);
        let title = $modal.find(".modal-title").attr('data-title');
        let action = $btnCaller.attr('act-action') ? $btnCaller.attr('act-action') : "Add" 
        let actUrl = $btnCaller.attr('act-url');

        let dataId = $btnCaller.parent("td:first").find(`[name*="[id]"]`).val()

        $modal.find('form').attr('action', actUrl);
        $modal.find(".modal-title").html(`${action} ${title}`);

        clearModalEdit($modal)
        $(".js-require___id").addClass("hidden")
        if(dataId){
            let rowEdit = $btnCaller.parents("tr:first")
            populateModalEdit(dataId,{modal:$modal,row:rowEdit})
            $(".js-require___id").removeClass("hidden")
        }
        modalBodyToggle()

        $('#formModal').modal({
            backdrop: 'static',
            keyboard: false
        });
    });

});

function afterSubmit (response) {
    $('#formModal').modal('toggle')
    $.info(response.data.message,()=>{
        location.reload()
    })
}

var populateModalEdit= (id,opt)=>{
    if(opt.modal==false && opt.row==false){
        console.log("modal and row is required")
        return 
    }
    let $modal = opt.modal
    let $row = opt.row
    let inputs = $row.find("input")
    $modal.find("#id").val(id)
    $modal.find("#parent_id").val( inputs.filter('[name*="parent_id"]').val() ).trigger("change")
    $modal.find("#name").val( inputs.filter('[name*="name"]').val() ).trigger("keyup")
    $modal.find("#link").val( inputs.filter('[name*="link"]').val() ).trigger("change")
    $modal.find("#icon").val( inputs.filter('[name*="em_class"]').val() )
    $modal.find("#status").val( inputs.filter('[name*="status"]').val() )

    $modal.find("#access_role").prop("checked",false)
    $modal.find("#access_role_value").val(0)
    if(inputs.filter('[name*="role_access_value"]').val()==1){
        $modal.find("#access_role").prop("checked",true)
        $modal.find("#access_role_value").val(inputs.filter('[name*="role_access_value"]').val())
    }
}

var clearModalEdit=($modal)=>{
    $modal.find("#id").val('')
    $modal.find("#parent_id").val('')
    $modal.find("#name").val('')
    $modal.find("#link").val('#')
    $modal.find("#icon").val('')
    $modal.find("#status").val('Published')
    $modal.find("#access_role").prop("checked",false)
    $modal.find("#access_role_value").val(0)
    $modal.find(".js-check-list__name").addClass("hidden")
}