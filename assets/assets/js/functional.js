var base_path = window.location.protocol + "//" + window.location.host

$.ajaxSetup({ cache: false })

var index = function (obj, i) { return obj[i] }

var isMap = 0
var mapLon = 0
var mapLat = 0
var mapId = ''

function initMap() {
	var uluru = {
		lat: mapLat,
		lng: mapLon
	}
	var map = new google.maps.Map(document.getElementById(mapId), {
		zoom: 14,
		center: uluru,
		scrollwheel: false
	})
	var marker = new google.maps.Marker({
		position: uluru,
		map: map
	})
}

// init all plugins
var initPlugins = function () {
	$(".select2").select2();
	$('.datetimepicker').datetimepicker({
		format: "YYYY-MM-DD HH:mm",
		icons: {
			time: 'fa fa-clock-o',
			date: 'fa fa-calendar',
			up: 'fa fa-chevron-up',
			down: 'fa fa-chevron-down',
			previous: 'fa fa-chevron-left',
			next: 'fa fa-chevron-right',
			today: 'fa fa-crosshairs',
			clear: 'fa fa-trash'
		}
	});
	$('.datepicker').datetimepicker({
		format: "YYYY-MM-DD", 
		widgetPositioning: {
			horizontal: "left", 
			vertical: 'auto'
		}
		// toolbarPlacement: 'bottom', 
		// showClose: true, 
		// orientation: "auto"
	});
	$('.timepicker').datetimepicker({
		format: 'HH:mm'
	});

	$('.wysiwyg').each(function () {
		var wysiwyg = $(this)
		var toolbar = $(document).find('[data-target="#' + $(this).attr('id') + '"]')
		$(this).wysiwyg({
			toolbarSelector: '[data-role=' + toolbar.attr('data-role') + ']'
		})
		$(this).wysiwyg().on('blur', function () {
			var $this = $(this)[0]
			var copyto = $($this).attr('data-copyto')
			$(copyto).val($($this).html())
		})
	})

	if (isMap)
		initMap()
}

// Ready Callback
var readyCallback = function () {
	initPlugins();
}

function inArray(needle, haystack) {
	var length = haystack.length
	for (var i = 0; i < length; i++) {
		if (haystack[i] == needle) return true
	}
	return false
}

$.renderData = function (args) {
	var targetParent = args.targetParent === undefined ? '' : 0,
		api = args.getURL,
		setData = args.setData

	$.when($.getData(api)).done(function (data) {
		$.apiDataCallback(data, setData, targetParent)
	})
}

var arrJsonData = function (obj, key, name, needed) {
	if (name) {
		for (x in obj) {
			if (obj[x][key] == name) {
				return obj[x][needed]
			}
		}
	} else {
		for (x in obj) {
			return obj[x][key]
		}
	}
}

$.apiDataCallback = function (data, setData, targetParent) {
	var objData, dataTarget, dataNot, newDataNot
	for (k in setData) {
		objData = setData[k]
		dataJsonType = objData.jsonType
		dataTarget = objData.target
		dataNot = objData.notation
		dataKey = objData.key
		dataName = objData.name
		dataNeeded = objData.needed
		objData.type === undefined ? dataType = 'val' : dataType = objData.type

		var obj = data

		if (dataJsonType == "array") {
			var value = arrJsonData(obj[dataNot], dataKey, dataName, dataNeeded)
		} else {
			var value = dataNot.split('.').reduce(index, obj)
		}

		// set value
		if (dataType === 'val')
			targetParent == 0 ? $(dataTarget).val(value) : $(targetParent).find(dataTarget).val(value)
		else if (dataType === 'append')
			targetParent == 0 ? $(dataTarget).append(value) : $(targetParent).find(dataTarget).append(value)
		else if (dataType === 'multiselect') {
			$.each(value.split(","), function (i, e) {
				targetParent == 0 ? $(dataTarget + " option[value='" + e + "']").prop("selected", true) : $(targetParent).find(dataTarget + " option[value='" + e + "']").prop("selected", true)
			})
		} else if (dataType === 'renderselect') {
			$(dataTarget).html('');
			$.each(value, function(i, e) {
				targetParent == 0 ? $(dataTarget).append('<option value="' + e.value + '">'+ e.text +'</option>') : $(targetParent).find(dataTarget).append('<option value="' + e.value + '">'+ e.text +'</option>')
			})
			// $.each(value.split(","), function (i, e) {
			// 	targetParent == 0 ? $(dataTarget + " option[value='" + e + "']").prop("selected", true) : $(targetParent).find(dataTarget + " option[value='" + e + "']").prop("selected", true)
			// })
		} else if (dataType === 'image') {
			if (targetParent == 0) {
				$(dataTarget).css('background-image', 'url(' + value + ')')
				$(dataTarget).attr('href', value)
			} else {
				$(targetParent).find(dataTarget).css('background-image', 'url(' + value + ')')
			}
		} else if (dataType === 'map') {
			isMap = 1
			mapId = 'map'
			mapLon = parseFloat(value.lon)
			mapLat = parseFloat(value.lat)
		} else if (dataType === 'valid') {
			var sym
			if (value)
				sym = '<span class="text-success">✓</span>'
			else
				sym = '<span class="text-danger">✗</span>'
			if (targetParent == 0) {
				$(dataTarget).append(sym)
			} else {
				$(targetParent).find(dataTarget).append(sym)
			}
		} else if (dataType === 'list_image') {
			var li = ''
			for (x in value) {
				var objct = value[x]
				li += '<li style="background-image: url(' + objct.img + ')">' + objct.name + '</li>'
			}
			if (targetParent == 0) {
				$(dataTarget).append(li)
			} else {
				$(targetParent).find(dataTarget).append(li)
			}
		} else if (dataType === 'status') {
			var stts_txt, stts_class
			stts_txt = value.text
			if (parseInt(value.code) == 0)
				stts_class = 'label-inverse'
			else if (parseInt(value.code) == 1)
				stts_class = 'label-success'

			if (targetParent == 0) {
				$(dataTarget).addClass(stts_class).append(stts_txt)
			} else {
				$(targetParent).find(dataTarget).attr('class', stts_class).append(stts_txt)
			}
		}
	}
	readyCallback()
}

$.getData = function (url, done, error, form) {
	return $.ajax({
		type: "GET",
		url: url,
		processData: false,
		contentType: false,
		dataType: 'json',
		beforeSend: function () {
			$.onLoading()
		},
		success: function (response) {
			$.hideLoading()
		},
		error: function (data) {
			$.hideLoading()
			$.alert("There's problem in processing your request, please contact your administrator")
		}
	})
}

$.currencyFormat = function (data) {
	return data.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

$.onLoading = function (message) {
	$(".overlayall").fadeIn()
	$(".loading").fadeIn()
	$(".load-full-page").fadeIn()
}

$.hideLoading = function () {
	$(".overlayall").fadeOut()
	$(".loading").fadeOut()
	$(".load-full-page").fadeOut()
	$(".contentData").fadeIn()
}

$.alert = function (message, ok, title) {
	// alert(message)
	$("#alertContent").html(message)
	$("#alertModal").modal({
		backdrop: 'static',
		keyboard: false
	})
	$("#alertModal .modal-title").html('Attention')
	if (title != undefined)
		$("#alertModal .modal-title").html(title)
	$("#alertModal").modal("show")
	$(".btnAlertOk").unbind("click")
	$(".btnAlertOk").click(function (e) {
		e.preventDefault()
		if (ok != undefined && typeof (ok) == 'function')
			ok()
		$("#alertModal").modal("hide")
	})
}


$.info = function (message, ok, title, redir_url) {
	// alert(message)
	$("#infoContent").html(message)
	$("#infoModal").modal({
		backdrop: 'static',
		keyboard: false
	})
	$("#infoModal .modal-title").html('Information')
	if (title != undefined)
		$("#infoModal .modal-title").html(title)
	$("#infoModal").modal("show")
	$(".btnInfoOk").unbind("click")
	$(".btnInfoOk").click(function (e) {
		e.preventDefault()
		if (ok != undefined && typeof (ok) == 'function')
			ok()
		if (redir_url)
			$.redirect(redir_url)
		$("#infoModal").modal("hide")
	})
}

$.confirm = function (message, yes, no, title) {
	// alert('confirm ajah')
	$("#confirmContent").html(message)
	$("#confirmModal").modal({
		backdrop: 'static',
		keyboard: false
	})
	$("#confirmModal .modal-title").html('Confirmation')
	if (title != undefined)
		$("#confirmModal .modal-title").html(title)
	$("#confirmModal").modal("show")
	$(".btnConfirmCancel").unbind("click")
	$(".btnConfirmCancel").click(function (e) {
		e.preventDefault();
		if (no != undefined && typeof (no) == 'function') {
			no();
		}
		$("#confirmModal").modal("hide")
	})
	$(".btnConfirmOk").unbind("click")
	$(".btnConfirmOk").click(function (e) {
		e.preventDefault();
		if (yes != undefined && typeof (yes) == 'function') {
			yes();
		}
		$("#confirmModal").modal("hide")
	})
}


$.prompt = function (message, ok) {
	return prompt(message)
}

$.resetParsley = function () {
	// var ret = false;
	$('form.parsley-validate').each(function () {
		if ($(this).parsley() != undefined) {
			$(this).parsley().reset();
			
			$.listen('parsley:field:error', function(){
				if (typeof(grecaptcha) !== "undefined") {
					grecaptcha.reset();
				}
			});
			// if ($(this).parsley().isValid()) {
			// 	// ret = true;
			// 	return true;
			// } else {
			// 	$(this).parsley().validate();
			// 	// ret = false;
			// 	return false;
			// }
		}
	})
}

$.clearForm = function (form) {
	$(form).find("input[type=number]")
		.val('')
	$(form).find("input[type=text]")
		.val('')
	$(form).find("input[type=file]")
		.val('')
	$(form).find("input[type=password]")
		.val('')
	$(form).find("textarea")
		.val('')
	$(form).find("select option")
		.removeAttr('selected')
	$(form).find("select").val('').trigger('change')
	$(form).find("input[type=checkbox]")
		.removeAttr('checked')
	$(form).find("input[type=radio]")
		.removeAttr('checked')
	$(form).find("input[type=radio]")
		.removeAttr('selected')
	$(form).find(".tinymce").each(function () {
		var id = $(this).attr('id')
		var editor = tinymce.get(id)
		if (editor != undefined) {
			var val = editor.setContent('')
		}
	})
	$(form).find(".tagitcontrol").each(function () {
		if ($.isFunction($.fn.tagit)) {
			$(this).tagit('removeAll')
		}
	})
}

$.postData = function (formData, url, done, error, form, redir_url) {
	$.ajax({
		type: "POST",
		url: url,
		data: formData,
		processData: false,
		contentType: false,
		dataType: 'json',
		beforeSend: function () {
			$.onLoading()
		},
		success: function (response) {
			// response = response.data

			$.hideLoading()
			if (response.error.errors == undefined) {
				var ok = function () {
					if (done != undefined && done != '') {
						if (typeof (done) == 'function') {
							done(response)
						}
						else {
							eval(done)
						}
					}
					if (form != undefined) {
						if ($(form).attr('clearform') != undefined)
							$.clearForm(form)
						$.resetParsley()
					}
				}
				if (done == undefined || done == '') {
					if (response.data.message != undefined && response.data.message != '')
						$.info(response.data.message, ok, undefined, redir_url)
				}
				else {
					ok()
				}
			}
			else {
				if (error != undefined && error != '') {
					if (typeof (error) == 'function')
						error(response)
					else
						eval(error)
				}
				else {
					var message = ''
					for (var i in response.error.errors) {
						var obj = response.error.errors[i]
						if (message != "")
							message += "<br/>"
						message += obj.message
					}
					if (response.error.message === "Action is not allowed") {
						confirmReload();
						return false;
					}
					if (response.data.title != undefined)
						$.alert(message, function () { }, response.data.title)
					else
						$.alert(message)
				}
			}
		},
		error: function (data) {
			$.hideLoading()
			let error_message = (data.responseJSON) ? data.responseJSON.error : "";
			if(data.responseJSON)
				$.alert(error_message.message);
			else
				$.alert("There's problem in processing your request, please contact your administrator")
		}
	})
}

confirmReload = function () {
	$.confirm('Your session has been expired, do you want to reload your page?', function() {
		location.reload();
	})
}

$.postAjax = function (url, data, done, error) {
	var formData = new FormData()
	// formData.append(csrf_token_name, $.cookie(csrf_cookie_name))
	$.each(data, function (name, val) {
		formData.append(name, val)
	})
	$.postData(formData, url, done, error)
}

$.back = function () {

	window.history.length > 0 ? window.history.go(-1) : $.redirect('')
}

$.redirect = function (url) {
	window.location.href = base_path + url
}

$.closeModal = function () {
	$(".modal").modal('hide')
}

$.htmlEntityDecode = function (el) {
	var thisTxt = $(el).text();
	$(el).html(thisTxt);
	var thisTxt2 = $(el).text();
	if (thisTxt2.indexOf("<b>") >= 0 || thisTxt2.indexOf("<i>") >= 0 || thisTxt2.indexOf("<strike>") >= 0 || thisTxt2.indexOf("<u>") >= 0)
		$(el).html(thisTxt2);
}

$(document).ready(function () {
	initPlugins();
	// $.ajaxSetup({ async: false })
	$.resetParsley()
	$('.back').click(function (e) {
		e.preventDefault()
		$.back()
	})

	$('[data-toggle="modal"]').on('click', function () {
		var href = $(this).attr('href')
		var target = $($(this).attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, '')))
		$.clearForm($(target).find("form"))
		$.resetParsley()
	})

	$(document).on('submit', 'form.ajax', function (e) {
		e.preventDefault();

		var parsleyRet = $.resetParsley();
		if (parsleyRet == false) {
			return;
		}

		var form = $(this)
		var data = $(this).serialize()
		var dataSplit = data.split("&")
		var formData = new FormData()
		var arr = {}

		var prevent = $(this).attr('prevent')
		if (prevent == 'true')
			return

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
				}
				else {
					var oldval = arr[unescape(str[0])]
					arr[unescape(str[0])] = new Array()
					// arr[unescape(str[0])].push(oldval)
					arr[unescape(str[0])].push(unescape(val))
				}
			}
			else if (arr[unescape(str[0])] != undefined) {
				if (Object.prototype.toString.call(arr[unescape(str[0])]) === '[object Array]') {
					arr[unescape(str[0])].push(unescape(val))
				}
				else {
					var oldval = arr[unescape(str[0])]
					arr[unescape(str[0])] = new Array()
					arr[unescape(str[0])].push(oldval)
					arr[unescape(str[0])].push(unescape(val))
				}
			}
			else
				arr[unescape(str[0])] = unescape(val)
			
			if ($(this).find("input[name=" + str[0] + "]").length > 1 && Object.prototype.toString.call(arr[unescape(str[0])]) !== '[object Array]' && (typeof attr !== typeof undefined && attr !== false && !inArray(attr, ['radio']))) {
				arr[unescape(str[0])] = new Array()
				arr[unescape(str[0])].push(unescape(val))
			}
		}
		$(this).find('input[type=file]').each(function () {
			var files = $(this)[0].files
			// formData.append($(this).attr('name'),files[0])
			var name = $(this).attr('name');
			
			if (name != undefined && name != ''){
				if(name.indexOf('[]') >= 0)
				{
					name = name.replace('[]','');
					if(arr[name] == undefined)
						arr[name] = new Array();
					
					arr[name].push(files[0]);
				}
				else{
					arr[name] = files[0];
				}
			}
		});
		
		$(this).find('.tinymce').each(function () {
			var id = $(this).attr('id')
			var editor = tinymce.get(id)
			if (editor != undefined) {
				var val = editor.getContent()
				arr[id] = val
			}
		})
		$(this).find('textarea').each(function () {
			var val = $(this).val()
			var name = $(this).attr('name')
			arr[name] = val
		})

		for (var key in arr) {
			if (arr[key] instanceof Array) {
				for (var i in arr[key])
					formData.append(key + "[]", arr[key][i])
			}
			else
				formData.append(key, arr[key])
		}
		$.postData(formData, $(form).attr('action'), $(form).attr('done'), $(form).attr('error'), form, $(form).attr('redir-url'))
	})

	$(".modal-footer .btn-primary").click(function (e) {
		$(this).parent().parent().find("form").submit()
	})

	$('.chosen-select').each(function () {
		$(this).chosen()
	})

	if ($.fn.modal.defaults != undefined) {
		$.fn.modal.defaults.keyboard = false
		$.fn.modal.defaults.backdrop = 'static'
	}
})
