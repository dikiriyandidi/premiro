functions.push(function () {
    $('#fsubmit').click(function() {
        let is_valid = true
        let error_message = []
        let featured_image = $('#image')[0].files[0]

        if(featured_image != undefined) {
            let featured_image_type = validateMimeType('Featured Image', featured_image, 'image')
            if(featured_image_type.status == false) {
                is_valid = false
                error_message.push(featured_image_type.message)
            }
        }

        if(is_valid == true) {
            $('#form_event').submit()
        }else{
            error_message = error_message.join("<br />")
            $.alert(error_message)
        }
    });
})