
functions.push(function(){
    // update layout
    $(window).bind('beforeunload', beforeUnloadEvent);
    $("#btn-submit-cancel__layout").bind("beforeunload",beforeUnloadEvent)

    $(document).on("click","#btn-submit__layout",(e)=>{
        let btn = $(e.target).hasClass('btn-update__layout-menu') ? $(e.target) : e.target
        let $btn = $(e.target).hasClass('btn-update__layout-menu') ? $(btn) : $(btn).parents('.btn-update__layout-menu:first')
        let inputUpdate = $("input.updated")
        let csrfValue = $('[name*="csrf"]:first').val();
        let csrfName = $('[name*="csrf"]:first').attr("name")
        $.onLoading()
        $(window).unbind("beforeunload")
        $.post("/cms/setting/menu/managepriority",inputUpdate.serialize()+`&${csrfName}=${csrfValue}`,(data)=>{
            $.hideLoading()
            $("#btn-submit-cancel__layout").trigger("click")
            if(data.data.status==true){
                $.info("Menu updated",()=>{
                    location.reload()
                })
            }else if(data.data.status==undefined){
                $.alert(data.error.message)
                $("#btn-submit-cancel__layout").bind("beforeunload",beforeUnloadEvent)
            }
        })
    })

    $('.btn-update__layout-menu').click(function (e) {
        let $modal = $("#formModal")
        let $btnCaller = $(e.currentTarget);
        let title = $modal.find(".modal-title").attr('data-title');
        let action = $btnCaller.attr('act-action') ? $btnCaller.attr('act-action') : "Confirm" 
        let actUrl = $btnCaller.attr('act-url');
        if($btnCaller.hasClass("disabled")){
            return
        }

        $modal.find('form').attr('action', actUrl);
        $modal.find(".modal-title").html(`${action} ${title}`);
        modalBodyToggle(".js-require__submit-confirm")
        $modal.find("#table_confirm > tbody").html('')
        $.each(_menuChanges,(row,k)=>{
            if( (k==undefined)==false ){
                let $k = $(k)
                    // insert init priority before current priority
                    $(`<td>${$k.attr("data-init_priority")}</td>`).insertBefore($k.find(".priority"))
                    $k.find(".td-status").remove().end()
                        .find(".td-em_class").remove().end()
                        .find(".td-action").remove()
                    let currentPriority = parseInt($k.find(".priority").html())
                    let initPriority = parseInt($k.attr("data-init_priority"));
                    let actionIcon = ( currentPriority == initPriority ) ? "" : ( currentPriority > initPriority ) ? "icon-arrow-down-circle" :  "icon-arrow-up-circle"
                    let actionColor = ( currentPriority == initPriority ) ? "" : ( currentPriority > initPriority ) ? "#f58927" : "#27c24c" 
                    $k.find(".priority").html(`<em class="${actionIcon}" style="color:${actionColor}"></em> ${currentPriority}`)
                k = $k.html()
                if( (actionIcon=="")==false ){
                    $modal.find("#table_confirm > tbody").append(`<tr>${k}</tr>`)
                }
            }
        })
        $("#formModal").modal({
            backdrop: 'static',
            keyboard: false
        });
    });

});

var beforeUnloadEvent = ()=> {
    if(_unsaved){
        return false
    }
}