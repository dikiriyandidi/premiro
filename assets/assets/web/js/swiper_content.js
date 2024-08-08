functions.push(function () {
	var swiper = new Swiper('.swiper-container', {
				nextButton: '.swiper-button-next',
				prevButton: '.swiper-button-prev',
				loop: true,
				speed: 500, 
				slidesPerView: 3, 
				spaceBetween: 24, 
				breakpoints: {
					700: {
						slidesPerView: 3, 
						spaceBetween: 8, 
					}, 
					640: {
						slidesPerView: 'auto'
					}
				}
			});
});