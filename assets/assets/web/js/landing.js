functions.push(function(){
    var tncTitle = $("#tncTitle").text();
    $("#tncTitle").html(tncTitle);
    var tncContent = $("#tncContent").text();
    $("#tncContent").html(tncContent);
    $("#tnc").on("click",function(n){n.preventDefault(),$.modal("#tncModal",null,null,15,"center")})

});

function afterError(response) {
    $.confirm(response.error.message, function() {
    $.redirect('/web/#subscribe')
    }, function() {})
}