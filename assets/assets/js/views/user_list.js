var inArray = (needle, haystack) => {
    var length = haystack.length
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) 
            return true
    }
    return false
}

functions.push(() => {
    $.postData = (formData, url, done, error, form) => {
        $.ajax({
            type: "POST",
            url: url,
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            beforeSend: function () {
                // $.onLoading();
            },
            success: function (response) {
                // $.hideLoading()
                if (response.error_code == 0) {

                    var ok = function () {
                        if (done != undefined && done != '') {
                            if (typeof (done) == 'function')
                                done(response)
                            else
                                eval(done)
                        }
                        if (form != undefined) {
                            // if ($(form).attr('clearform') != undefined)
                            //     $.clearForm(form)
                            // $.resetParsley()
                        }
                    }
                    if (response.message != undefined && response.message != '')
                        alert(response.message, ok)
                    else
                        ok()
                } else {
                    if (error != undefined && error != '') {
                        if (typeof (error) == 'function')
                            error(response)
                        else
                            eval(error)
                    } else {
                        alert(response.error)
                    }
                }
            },
            error: function (data) {
                // $.hideLoading()
                alert("There's problem in processing your request, please contact your administrator")
            }
        })
    }

    $("form.ajax").submit(function (e) {
        e.preventDefault()
        var form = $(this)
        var data = $(this).serialize()
        var dataSplit = data.split("&")
        var formData = new FormData()
        var arr = {}

        // formData.append(csrf_token_name, $.cookie(csrf_cookie_name))
        for (var i = 0; i < dataSplit.length; i++) {
            var str = dataSplit[i].split("=")
            var val = str[1]
            var attr = $(this).find("input[name='" + unescape(str[0]) + "']").attr('type')
            var exclude = ["checkbox", "radio"]
            if ($(this).find("input[name='" + unescape(str[0]) + "']").val() != undefined && (typeof attr !== typeof undefined && attr !== false && !inArray(attr, exclude))) {
                val = $(this).find("input[name=" + str[0] + "]").val()
            }

            if ($(this).find("select[name='" + unescape(str[0]) + "']").attr('multiple') != undefined) {
                if (Object.prototype.toString.call(arr[unescape(str[0])]) === '[object Array]') {
                    arr[unescape(str[0])].push(unescape(val))
                } else {
                    var oldval = arr[unescape(str[0])]
                    arr[unescape(str[0])] = new Array()
                    // arr[unescape(str[0])].push(oldval)
                    arr[unescape(str[0])].push(unescape(val))
                }
            } else if (arr[unescape(str[0])] != undefined) {
                if (Object.prototype.toString.call(arr[unescape(str[0])]) === '[object Array]') {
                    arr[unescape(str[0])].push(unescape(val))
                } else {
                    var oldval = arr[unescape(str[0])]
                    arr[unescape(str[0])] = new Array()
                    arr[unescape(str[0])].push(oldval)
                    arr[unescape(str[0])].push(unescape(val))
                }
            } else
                arr[unescape(str[0])] = unescape(val)
                
            if ($(this).find("input[name=" + str[0] + "]").length > 1 && Object.prototype.toString.call(arr[unescape(str[0])]) !== '[object Array]' && (typeof attr !== typeof undefined && attr !== false && !inArray(attr, ['radio']))) {
                arr[unescape(str[0])] = new Array()
                arr[unescape(str[0])].push(unescape(val))
            }
        }
        $(this).find('input[type=file]').each(function () {
            var files = $(this)[0].files
            // formData.append($(this).attr('name'),files[0])
            var name = $(this).attr('name')
            if (name != undefined && name != '')
                arr[name] = files[0]
        })
        $(this).find('.tinymce').each(function () {
            var id = $(this).attr('id')
            var editor = tinymce.get(id)
            if (editor != undefined) {
                var val = editor.getContent()
                arr[id] = val
            }
        })

        for (var key in arr) {
            if (arr[key] instanceof Array) {
                for (var i in arr[key])
                    formData.append(key + "[]", arr[key][i])
            } else
                formData.append(key, arr[key])
        }
        $.postData(formData, $(form).attr('action'), $(form).attr('done'), $(form).attr('error'), form)
    })
    // $("#btn").click(() => {
    //     $("#formSubmit").submit()
    //     $.post('http://localhost:2007/cms/user/post',{},function(data){
    //         alert(data)
    //     })
    // })
})

// let redraw = (target,data) => {
//     $(target).empty()
//     for(let i in data){
//         let ele = data[i]
//         $(target).append($('td').html(ele.name))
//         $(target).append($('td').html(ele.email))
//     }
// }

// $(document).on('click','.btnEdit',() => {
//     //request ajax
//     $.post('/cms/user/getdetail',{'id': 1}, (data)=>{
//         if(data == null)
//             $.alert("oi error")
//         redraw(data)
//     })
//     redraw([{
//         name: 'lorem',
//         address: 'lorem'
//     }])
// })