functions.push(function () {
    check_type()
    $("#type").change(function () {
        check_type()
    })
    function check_type() {
        let type = $('#type').val()

        if(type == 'image') {
            $('.image-wrapper').show()
            $('.video-wrapper').hide()
        }else if(type == 'video') {
            $('.image-wrapper').hide()
            $('.video-wrapper').show()
        }
    }

    $('#fsubmit').click(async function () {
        let is_valid = true
        let error_message = []
        let featured_image = $('#featured_image')[0].files[0]
        let video_file = $('#video_file')[0].files[0]
        let video_cover = $('#video_cover')[0].files[0]
        let type = $('#type').val()

        // validate mime type
        let is_image = true
        let is_video = true
        if(featured_image != undefined && type == 'image') {
            is_image = true
            let el = 'Featured Image'
            let featured_image_type = validateMimeType(el, featured_image, 'image')
            if(featured_image_type.status == false) {
                is_valid = false
                is_image = false
                error_message.push(featured_image_type.message)
            }
            if(is_image === true) {
                let featured_image_dimension = await validateDimension(el, featured_image, 'equal', 380, 240)
                if(featured_image_dimension == false) {
                    is_valid = false
                    error_message.push("Featured Image dimension must be: 380 x 240!")
                }
            }
        }
        if(video_file != undefined && type == 'video') {
            is_video = true
            let video_file_type = validateMimeType('Video', video_file, 'video')
            if(video_file_type.status == false) {
                is_valid = false
                is_video = false
                error_message.push(video_file_type.message)
            }

            if(is_video === true) {
                let video_file_size = validateMaxSize('Video', video_file, 201457280, '200mb')

                if(video_file_size.status == false) {
                    is_valid = false
                    error_message.push(video_file_size.message)
                }
            }
        }
        if(video_cover != undefined && type == 'video') {
            let video_cover_type = validateMimeType('Video Cover', video_cover, 'image')
            if(video_cover_type.status == false) {
                is_valid = false
                error_message.push(video_cover_type.message)
            }
        }

        if(is_valid == true) {
            if(type == 'image') {
                $('#video_file').val('')
                $('#video_cover').val('')
            }else if(type == 'video') {
                $('#featured_image').val('')
            }

            $('#form_article').submit()
        }else{
            error_message = error_message.join("<br />")
            $.alert(error_message)
        }

        // let formData = new FormData();
        // let file = $('#video_file')[0].files[0]
        // formData.append('video_file', file);
        // let xhr = new XMLHttpRequest();

        // // your url upload
        // xhr.open('post', '/cms/article/manage', true);

        // xhr.upload.onprogress = function (e) {
        //     if (e.lengthComputable) {
        //         let percentage = (e.loaded / e.total) * 100;
        //         console.log(percentage + "%");
        //     }
        // };

        // xhr.onerror = function (e) {
        //     console.log('Error');
        //     console.log(e);
        // };
        // xhr.onload = function () {
        //     console.log(this.statusText);
        // };

        // xhr.send(formData);
    });
    $(document).ready(function() {
        // var phase_html = $('#phase_id').html(); //simpan base html dropdownnya  
        // var campaign_id = $("#campaign_id").val();
        // var select = ".phase-"+campaign_id;

        // $('#phase_id').html(phase_html);
        // $("#select2-phase_id-container").text('');
        // $('#phase_id').find('option:not("'+select+'")').remove();

        // $( "#campaign_id" ).change(function() {
        //     var campaign_id = $("#campaign_id").val();
        //     var select = ".phase-"+campaign_id;
            
        //     $('#phase_id').html(phase_html);
        //     $("#select2-phase_id-container").text('');
            
        //     $('#phase_id').find('option:not("'+select+'")').remove();
        // });
    });
})