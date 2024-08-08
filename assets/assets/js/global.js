function run()
{
  for(var i in functions)
  {
    functions[i]();
  }
}

$(document).ready(function(){
  run();

  $.fn.dataTable.ext.errMode = function ( settings, helpPage, message ) { 
    var error = $.parseJSON(settings.jqXHR.responseText).error
    var error_message = error.message
    if (error_message === "Action is not allowed") {
      confirmReload();
    }
	};
});
