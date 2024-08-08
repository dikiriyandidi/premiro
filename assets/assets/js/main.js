// Base Path
var base_path = window.location.protocol + "//" + window.location.host

let imageHandler = () => {
	var range = this.quill.getSelection();
	var value = prompt('Enter image URL');
	value ? this.quill.insertEmbed(range.index, 'image', value, Quill.sources.USER) : null;
}
console.log(moment.version)
console.log($.fn.dataTable.version)
console.log(Modernizr)
functions.push(function () {
	// Modal -> Body
	$('.formModal').appendTo("body")
	$('#confirmModal').appendTo("body")
	$('#infoModal').appendTo("body")
	$('#alertModal').appendTo("body")

	// Currency Format
	$('.curr').each(function () {
		$this = $(this)
		$this.text($.currencyFormat($this.text()))
	})
	// Select2
	$('.select2').each(function () {
		var cClass = $(this).data('cclass');
		var ddClass = $(this).data('ddclass');
		$(this).select2({
			containerCssClass: cClass,
			dropdownCssClass: ddClass
		});
	});
	//Datetimepicker
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
	})
	// Datepicker
	$('.datepicker').datetimepicker({
		format: "YYYY-MM-DD"
	});
	// Timepicker
	$('.timepicker').datetimepicker({
		format: 'HH:mm'
	});

	$('.quill-editor').each(function () {
		let wysiwyg = $(this);
		let wysiwyg_id = $(wysiwyg).attr('id')
		// wysiwyg to html
		$.htmlEntityDecode(wysiwyg);
		// end wysiwyg to html

		quillToolbarOptions = [
			[{
				size: ['small', false, 'large', 'huge']
			}],
			['bold', 'italic', 'underline', 'strike'],
			['blockquote', {
				'align': []
			}],
			[{
				'list': 'ordered'
			}, {
				'list': 'bullet'
			}],
			[{
				'script': 'sub'
			}, {
				'script': 'super'
			}],
			[{
				'indent': '-1'
			}, {
				'indent': '+1'
			}],
			['link', 'image', 'video']
		]

		var quill = new Quill(`#${wysiwyg_id}`, {
			modules: {
				toolbar: {
					container: quillToolbarOptions,
					handlers: {
						image: imageHandler
					}
				}
			},
			bounds: `#${wysiwyg_id}`,
			theme: 'snow'
		});

		quill.on('text-change', function (delta, oldDelta, source) {
			var el = $(wysiwyg).find('.ql-editor');
			var copyto = $(wysiwyg).attr('data-copyto');
			$(copyto).val($(el).html());
		});
	});

	// WYSIWYG
	$('.wysiwyg').each(function () {
		var wysiwyg = $(this);

		// wysiwyg to html
		$.htmlEntityDecode(wysiwyg);
		// end wysiwyg to html

		var toolbar = $(document).find('[data-target="#' + $(this).attr('id') + '"]');
		$(this).wysiwyg({
			toolbarSelector: '[data-role=' + toolbar.attr('data-role') + ']'
		});
		$(this).wysiwyg().on('blur', function () {
			var $this = $(this)[0];
			var copyto = $($this).attr('data-copyto');
			$(copyto).val($($this).html());
		});
	});

	bindFileUpload();

	$('.clone').each(function () {
		$this = $(this);
		var cloneEl = $(this).find('.clone-el');
		var btnTxt = $(this).attr('btn-txt') ? $(this).attr('btn-txt') : 'Add New';
		var divAdd = $('<div class="div-clone-add"><button type="button" class="btn btn-wknd btn-sm"><span class="icon-span-filestyle fa fa-plus icon-text-l"></span><span>' + btnTxt + '</span></button></div>');

		$(this).append(divAdd);
		$(cloneEl).remove();

		$('.div-clone-add button').on('click', function () {
			var template = $(cloneEl).clone();
			template.removeClass('clone-el');
			var templateClone = $(template);
			var newEl = $('<div class="clones"></div>');
			var divCloneEl = $('<div class="div-clone-el"></div>');
			var divCloneX = $('<div class="div-clone-x"><button title="Remove" type="button" class="btn btn-danger btn-xs"><i class="fa fa-times"></i></button></div>');

			$(templateClone).appendTo(divCloneEl);
			$(divCloneX).appendTo(newEl);
			$(divCloneEl).appendTo(newEl);
			$(newEl).insertBefore($('.div-clone-add'));

			$('.div-clone-x button').on('click', function () {
				removeCloneEl($(this));
			})

			listenFileChange();
		})
		$('.div-clone-x button').on('click', function () {
			removeCloneEl($(this));
		})
	})

	function removeCloneEl(btn) {
		$(btn).parents('.clones').remove();
	}

	function bindFileUpload() {
		var inputfile = $('input:file');
		$(inputfile).each(function () {
			var path = $(this).attr('data-path');
			if (path)
				$(this).parent().append($('<div class="preview-file"><a href="' + path + '" target="_blank"><img class="img-preview media-box-object img-responsive img-rounded" src="' + path + '"/></a></div>'));
		})

		listenFileChange();
	}

	function listenFileChange() {
		var inputs = document.querySelectorAll('input[type="file"]');
		Array.prototype.forEach.call(inputs, function (input) {
			var label = input.nextElementSibling;
			var labelVal = $(label).innerHTML;

			$(label).unbind("click");
			$(label).click(function () {
				$(this).prev('input[type="file"]').trigger('click');
			});

			$(input).unbind("change");
			$(input).change(function (e) {
				var fileName = '';
				if (this.files && this.files.length > 1)
					fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
				else
					fileName = e.target.value.split('\\').pop();

				if (fileName)
					label.querySelector('span').innerHTML = fileName;
				else
					label.innerHTML = labelVal;

				$(this).nextAll('.preview-file').remove();
			});

			// Firefox bug fix
			input.addEventListener('focus', function () {
				input.classList.add('has-focus');
			});
			input.addEventListener('blur', function () {
				input.classList.remove('has-focus');
			});

		});
	}

	$.reloadDatatable = function (table, url) {
		if (url != undefined) {
			eval(table).ajax.url(url).load();
		} else {
			eval(table).ajax.reload(null, false);
		}
	}
});

// Riri : validate mime type
let validateMimeType = (el, file, type) => {
	let response = {
		status: true,
		message: el + ' type must be: jpg, png, gif, jpeg!'
	}
	let mimetype = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']

	if (type == 'video') {
		mimetype = ['video/mp4']
		response.message = el + ' type must be: mp4!'
	} else if (type == 'csv') {
		mimetype = ['application/csv', 'application/vnd.ms-excel']
		response.message = el + ' type must be: csv!'
	}

	if ($.inArray(file.type, mimetype) < 0) {
		response.status = false
	}

	return response
}

// Riri : validate max size (max_size in byte)
let validateMaxSize = (el, file, max_size, size_text) => {
	let response = {
		status: true,
		message: 'Maximum ' + el + ' file size is ' + size_text
	}
	if (file.size > max_size) {
		response.status = false
	}

	return response
}

// Riri : validate dimension
async function validateDimension(el, file, type, width = null, height = null, is_callback = null) {
	let _URL = window.URL || window.webkitURL
	let response = true

	img = new Image()
	img.src = _URL.createObjectURL(file)
	let image = await getImageDimension(img)

	if (type == 'equal') {
		response = equalRule(width, height, image)
	} else if (type == 'min') {
		response = minRule(width, height, image)
	} else if (type == 'max') {
		response = max_rule(width, height, image)
	} else if (type == 'banner_no_event') {
		response = bannerNoEvent(width, height, image)
	}

	return response
}

let getImageDimension = (img) => {
	return new Promise(function (resolve, reject) {
		img.onerror = function () {
			resolve('Invalid')
		}

		img.onload = function () {
			let data = {
				width: this.width,
				height: this.height
			}
			resolve(data)
		}
	})
}

let equalRule = (w, h, features) => {
	let result = false
	if (w != null & h != null) {
		if (w == features.width && h == features.height) {
			result = true
		}
	} else if (w != null & h == null) {
		result = (w == features.width)
	} else if (w == null & h != null) {
		result = (h == features.height)
	}

	return result
}

let minRule = (w, h, features) => {
	let result = false
	if (w != null & h != null) {
		if (w <= features.width && h <= features.height) {
			result = true
		}
	} else if (w != null & h == null) {
		result = (w <= features.width)
	} else if (w == null & h != null) {
		result = (h <= features.height)
	}

	return result
}


let maxRule = (w, h, features) => {
	let result = false
	if (w != null & h != null) {
		if (w >= features.width && h >= features.height) {
			result = true
		}
	} else if (w != null & h == null) {
		result = (w >= features.width)
	} else if (w == null & h != null) {
		result = (h >= features.height)
	}

	return result
}

let bannerNoEvent = (w, h, features) => {
	let result = false
	if ((features.width == w[0] || features.width == w[1]) && features.height == h) {
		result = true
	}

	return result
}

const previewImage = ($input, $target) => {

	let reader = new FileReader()
	reader.onload = (e) => {
		$target.attr("src", e.target.result)
	}
	reader.readAsDataURL($input[0].files[0])
}

// upload file for *-wrapper.enhance
$(document).on('change', 'input[type="file"]', (e) => {
	$input = $(e.target)

	let $parent = $($input.parents('.form-group[class*="-wrapper"]:first')[0])

	var $target = $parent.find(".has-upload-image > img")
	let fileName = [];
	let currentImagePreview = $parent.find('.has-upload-image[href!="#"],.has-upload-image[href!=""]')
	var $divAfterWrapper = $parent.find('.control-label').next("div");

	$target.css("width", 150)
	if (currentImagePreview.length > 0) {
		currentImagePreview.addClass("collapse")
	}

	$divAfterWrapper.find(".preview-image").removeClass("collapse")
	if ($divAfterWrapper.find(".preview-image").length == 0) {
		$divAfterWrapper.append("<img src='' class='preview-image' width='150px'>")
	}

	if ($input[0].files.length > 0) {
		$.each($input[0].files, (key, row) => {
			fileName.push(row.name)
		})

		previewImage($input, $divAfterWrapper.find(".preview-image"))
	} else {
		fileName = ["Choose file"]
		currentImagePreview.removeClass("collapse")
		$divAfterWrapper.find(".preview-image").css("width", "").attr("src", "#").addClass("collapse")
	}


	$input.next('label').find('.choose-file').html(fileName.join(','))

})