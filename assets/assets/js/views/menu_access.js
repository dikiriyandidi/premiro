function afterSubmit(response){
    $.info(response.data.message);
}

functions.push(function(){
    
    $(document).on('click','.rows.menu',(e)=>{
        row = $(e.toElement).parents("tr:first")
        $row = $(row)
        if($(e.target).hasClass('rows menu'))
        {
            $row = $(e.target)
        }

        // dont apply collapase toggle on btn-action
        if(
            $(e.toElement).is('[class*="icon-"]:not(.toggle-icon),.btn-action')
        ){
            return
        }
        // toggleTreeData($row)
        if($row.hasClass('rows menu') ){
            if($row.hasClass('toggle-active')){
                $row.removeClass('toggle-active')
                toggleChild($row,'deactivated')
                patchToggle($row,"deactivated")
                return
            }
            
            $row.addClass('toggle-active')
            toggleChild($row,'activated')
            patchToggle($row,"activated")
        }
    })

    $(document).on('click','.btn-action.move-up,.btn-action.move-down',(e)=>{
        let btn = $(e.target).hasClass('btn-action') ? $(e.target) : e.target
        let $btn = $(e.target).hasClass('btn-action-icon') ? $(btn).parents('.btn-action:first') : $(btn)
        let $row = $btn.parents('tr:first')
        let parentId = $row.attr("data-parent_id")
        let dataId = $row.attr("data-id")
        let direction = $btn.hasClass('move-up') ? "up" : "down"
        if($btn.hasClass("disabled")){
            return false
        }

        let nextSibling = $row.nextAll(`[data-parent_id="${parentId}"]:first`)
        let beforeSibling = $row.prevAll(`[data-parent_id="${parentId}"]:first`)

        let sibling = false;
        switch(direction){
            case "up":
            $row.insertBefore(beforeSibling)
            sibling = beforeSibling
            break;
            case "down":
            $row.insertAfter(nextSibling)
            sibling = nextSibling
            break;
        }
        
        // move children to follow parent
        $row.addClass("just-moved")
        $(`tr.rows.menu[data-parent_id="${dataId}"]`).addClass("updated").addClass("just-moved").insertAfter($row)
        if(sibling){
            dataIdSibling = $(sibling).attr("data-id")
            $(`tr.rows.menu[data-parent_id="${dataIdSibling}"]`).addClass("updated").insertAfter($(sibling))
        }

        setTimeout(()=>{
            $(".just-moved").removeClass("just-moved")
        },650)

        updatePriority(parentId)
        btnValidAction()
    })

    $(function(){
        // disabled submit button and trigger published menu to show
        btnValidAction()
        parentCompability()
        // $('.btn.filter__menu-status[value="published"]').trigger("click")
    })

    // toggle menu filter
    $(document).on("click",".filter__menu-status",(e)=>{
        $btn = $(e.currentTarget)
        let value = $btn.attr("value")

        $(".filter__menu-status").removeClass("btn-warning").addClass("btn-default")
        $(`.rows.menu`).addClass("hidden")
        toggleFilterData(value)
    })

    // grant / revoke current access
    $(document).on("click","#access_role",(e)=>{
        var checked = $(e.target).is(":checked")
        $("#access_role_value").val(0)
        if(checked){
            $("#access_role_value").val(1)
        }
    })

    $(document).on("change","#parent_id",function(e){
        var $ob = $(this)
        var crVar = $ob.val()
        var children = childrenBasedSymbol($ob,crVar,"~")
        iconInput(true)
        if([null,0,2].indexOf(children)>-1){
            iconInput(false)
        }

        $("#link").parents("div.form-group:first").removeClass("hidden")
        if([null,0].indexOf(children)>-1){
            $("#link").parents("div.form-group:first").addClass("hidden")
        }

        parentCompability()
        if(children>2){
            $(this).find(`option:not([value="${crVar}"])`).addClass("hidden")
            $(this).find(`option[value="${crVar}"]`).removeClass("hidden")
        }
    })

    // $(document).on("focusin keyup","#name",function(){
    //     var Value = this.value;
    //     $(".js-check-list__name").removeClass('hidden')
    //     checkName(Value,/(?=.*?[a-zA-Z0-9]{1})/, 0);
    // })

    $(document).on("change","#status",function(){
        var value = this.value;
        $(".js-status-trashed").addClass("hidden")
        if(value=="Trashed"){
            $.confirm("Changing status to trashed will delete current menu, this action cannot be undone.",()=>{
                $(".js-status-trashed").removeClass("hidden")
            },()=>{
                $(this).val("Unpublished")
            })
        }
    })

    $(document).on("click","#fsubmit",()=>{
        $(window).unbind("beforeunload")
    })

    let _state = [];
    var toggleChild = ($row,state='activated')=>{
        var currentPath = $row.attr('data-rootpath')
        var childs = $(`[data-rootpath*="${currentPath}_"]`).not($row)
        
        if(childs.length>0){
            $.each(childs,(i,childRow)=>{
                setState($(childRow),state)
                toggleChild($(childRow),state)
            })
        }

    }

    let patchToggle = ($row)=>{
        let menuShown = $(`.toggle-active[data-rootpath*="${$row.attr("data-rootpath")}_"]`)
        $.each(menuShown,(i,input)=>{
            let $input = $(input)
            $input.addClass('toggle-active')
            toggleChild($input,'activated')
        })
    }
    
    var setState = ($row,state)=>{
        let dataId = $row.attr("data-id")
        switch(state){
            case 'activated' :
                $row.addClass('collapse')
                // $row.addClass('collapse').addClass("toggle-active")
                break;
            case 'deactivated' : 
                $row.removeClass('collapse')
                // $row.removeClass('collapse').removeClass("toggle-active")
            break;
        }

    }
    
    var btnValidAction = ()=>{
        let parentOnly = $("tr.rows.menu.has-child")
        $(".btn-action.move-up,.btn-action.move-down").removeClass("disabled")
        $(`[data-parent_id="0"]`).find(".btn-action.move-up,.btn-action.move-down").addClass("hidden")
        $.each(parentOnly,(key,r)=>{
            let $r = $(r)
            let dataId = $r.attr("data-id")
            let $table = $r.parents("table")
            $table.find(`[data-parent_id="${dataId}"]:first`).find(".btn-action.move-up").addClass("disabled")
            $table.find(`[data-parent_id="${dataId}"]:last`).find(".btn-action.move-down").addClass("disabled")
        })
        submitValidAction()
    }

    var submitValidAction = ()=>{
        let updated = $(".updated")
        _menuChanges = getOnlyRowUpdated(updated)
        $(".btn-update__layout-menu").removeClass("btn-wknd").addClass("disabled btn-default").attr("title","No layout changes")
        if( updated.length>0 ){
            _unsaved = true
            $(".btn-update__layout-menu").addClass("btn-wknd").removeClass("disabled").attr("title","Save layout changes")
        }

    }

    var updatePriority = (parentId)=>{
        var rowsAffected = $(`tr.rows.menu[data-parent_id="${parentId}"]`)
        $.each(rowsAffected,(key,row)=>{
            let currentOrder = key+1
            $(row).addClass("updated").find(".priority").html(currentOrder).end()
                    .find('input[name*="[priority]"]').val(currentOrder).end()
                    .find('input').addClass("updated")
        })
    }

    var getOnlyRowUpdated = (updatedRow)=>{
        let rowLookup = []
        let rowCollection = []
        $.each(updatedRow,(k,ob)=>{

            let row = $(ob).hasClass("rows menu") ? $(ob) : $(ob).parents("tr:first")
            if(rowLookup[$(row).attr("data-id")]==undefined){
                rowLookup[$(row).attr("data-id")] = $(row).attr("data-id")
                rowCollection.push($(row).clone()[0].outerHTML)
            }

        })
        return rowCollection
    }

    var childrenBasedSymbol = ($select,val,symbol="~")=>{
        var children = $select.find(`option[value="${val}"]`).html().match(new RegExp(symbol, "g"))
        children = (children==null) ? 0 : children.length 
        return children
    }

    var iconInput = (visible=false)=>{
        $("#icon").parents("div.form-group").removeClass("hidden")
        if(visible==false){
            $("#icon").parents("div.form-group").addClass("hidden")
        }
    }
    
    var parentCompability=()=>{
        var allOption = $("#parent_id").find("option")
        allOption.removeClass("hidden")
        let unpublishedRow = unpublishedCompability()
        allOption.each((i,ob)=>{
            let value = $(ob).attr("value")
            let child = childrenBasedSymbol($("#parent_id"),value,"~")
            if(child>2 || unpublishedRow.indexOf(value)>-1){
                $(ob).addClass("hidden")
            }
        })
    }

    var unpublishedCompability = ()=>{
        var hiddenParent = $(".rows.menu.unpublished")

        rowCollection = []
        hiddenParent.each((i,ob)=>{
            let rootpath = $(ob).attr("data-rootpath")
            let dataId = $(ob).attr("data-id")
            rowCollection[dataId] = dataId

            $(`.rows.menu[data-rootpath*="${rootpath}_"]`).each((j,childOb)=>{
                dataId = $(childOb).attr("data-id")
                rowCollection[dataId] = dataId
            })
        })
        return rowCollection
    }

    // var checkName = (Value,reg, nth)=>{
    //     var li = $('.js-check-list__name li');
    //     if(reg.test(Value)){
    //         li.eq(nth).attr('data-passed',true)
    //     } else {
    //         li.eq(nth).attr('data-passed',false)
    //     }
    // }

});

var modalBodyToggle = (selector=false)=>{
    var $modal = $("#formModal")
        $modal.find(".modal-body,.modal-footer").addClass("hidden")
    if(selector){
        $modal.find(`.modal-body${selector},.modal-footer${selector}`).removeClass("hidden")
        return
    }
    $modal.find(`.modal-body:not([class*="js-require__"]),.modal-footer:not(*[class*="js-require__"])`).removeClass("hidden")
}