functions.push(function () {
    $("#custom_code").change(function () {
        
        check_type()
    })
    function check_type() {
        
        let type = $('#custom_code').val()

        if(type == 'No') {
            $('.general-code').show()
            $('#general_code').val("")
        }else if(type == 'Yes') {
            $('#general_code').text("")
            $('.general-code').hide()
        }
    }

    $('#fsubmit').click(function() {
        let is_valid = true
        let error_message = []

        if(is_valid == true) {
            $('#form_voucher').submit()
        }else{
            error_message = error_message.join("<br />")
            $.alert(error_message)
        }
    });
})