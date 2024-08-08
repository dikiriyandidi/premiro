
functions.push(function(){
});

var toggleFilterData = (type)=>{
    if(type=="all"){
        $(".filter__menu-status").addClass("btn-warning")
        $(`.rows.menu`).removeClass("hidden")
        return
    }
    $(`.filter__menu-status[value="${type}"]`).addClass("btn-warning")
    var selectedMenus = $(`.rows.menu.${type}`)
    selectedMenus.removeClass("hidden")
    
    if(type=="published"){
        // collapse parent if has any collapsed parent
        let parentOnly = selectedMenus.filter(".has-child")
        let parentOnlyCollection = toggleFilter.getParentRow(parentOnly,type)
        $.each(parentOnly,(i,row)=>{
            let parentId = $(row).attr("data-parent_id")
            if(parentOnlyCollection[parentId]){
                $(row).addClass("hidden")
            }
        })
        
        // collapse child if has any collapsed parent
        let childOnly = selectedMenus.filter(":not(.has-child)")
        let parentCollection = toggleFilter.getParentRow(childOnly,type)
        $.each(childOnly,(i,row)=>{
            let parentId = $(row).attr("data-parent_id")
            if(parentCollection[parentId]){
                $(row).addClass("hidden")
            }
        })
    }else if("unpublished"){
        // show children if has any collapsed parent
        let parentOnly = selectedMenus.filter(".has-child")
        $.each(parentOnly,(i,row)=>{
            let rootpath = $(row).attr("data-rootpath")
            $(`[data-rootpath*="${rootpath}_"]`).removeClass("hidden")
        })
        
        // show parent if has any collapsed children
        let childOnly = selectedMenus.filter(":not(.has-child)")
        let parentCollection = toggleFilter.getChildRow(childOnly,type)
        $.each(childOnly,(i,row)=>{
            let parentId = $(row).attr("data-parent_id")
            if(parentCollection[parentId]){
                $(`[data-id=${parentId}]`).removeClass("hidden")
            }
        })
    }
}
var toggleFilter = {
    getParentRow:(childOnly,type)=>{
        let parentCollection = []
        $.each(childOnly,(i,row)=>{
            let parentId = $(row).attr("data-parent_id")
            if(parentCollection.includes(parentId)==false && $(`.rows.menu[data-id="${parentId}"]`).length>0){
                parentState = $(`.rows.menu[data-id="${parentId}"]`).hasClass("hidden") ? "unpublished" : "published"
                if(parentState!=type){
                    parentCollection[parentId] = parentState
                }
            }
        })
        return parentCollection
    },
    getChildRow:(parentOnly,type)=>{
        let parentCollection = []
        $.each(parentOnly,(i,row)=>{
            let parentId = $(row).attr("data-parent_id")
            if(parentCollection.includes(parentId)==false && $(`.rows.menu[data-id="${parentId}"]`).length>0){
                parentState = $(`.rows.menu[data-id="${parentId}"]`).hasClass("hidden") ? "unpublished" : "published"
                parentCollection[parentId] = parentState
                if(parentState!=type){
                }
            }
        })
        return parentCollection
    }
}