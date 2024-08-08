functions.push(function(){
    $('#act_logout').click(function(e){
        e.preventDefault()
        url = $(this).attr('href')
        $.confirm(
            "Are you sure to logout?",
            function(){
                $.redirect(url)
            }
        )
    })
})