jQuery(document).ready(function(){

	"use strict";
	
	// here all ready functions
	loader();
	scroll_top();
	
	$('#cn-accept-cookie').click(function() {
		setCookie('accept-cookie', 'true');
		$('#cookie-notice').removeClass('cookie-notice-visible').addClass('cookie-notice-hidden');
	});
	
	var acceptcookie = getCookie('accept-cookie');
	if (acceptcookie == 'true') {
		$('#cookie-notice').removeClass('cookie-notice-visible').addClass('cookie-notice-hidden');
	}
	
	$('#cn-decline-cookie').click(function() {
		window['ga-disable-G-D7T2DPY26Q'] = true;
		if (window.ga) window.ga('remove');
		if (document.cookie) {
			var cookies = document.cookie.split(";");

			for (var i = 0; i < cookies.length; i++) {
				var cookie = cookies[i];
				var eqPos = cookie.indexOf("=");
				var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
				var domain = document.domain;
				document.cookie = name + "=;path=/;domain=" + domain + ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
				document.cookie = name + "=;path=/;domain=" + domain.replace('www.', '') + ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
			}
		}
		alert("Cookies have been removed.");
	});
});

//#############################
// ---------- LOADER ----------
//#############################

function loader() {
   "use strict";
   setTimeout(function () {
     $('#loader-wrapper').fadeOut();
   }, 1500);
};

//####################################
// ---------- SCROLLING TOP ----------
//####################################

function scroll_top(){
    "use strict";
	var offset = 300,
		offset_opacity = 1200,
		scroll_top_duration = 700,
		$back_to_top = $('.cd-top');

	$(window).scroll(function(){
		( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
		if( $(this).scrollTop() > offset_opacity ) { 
			$back_to_top.addClass('cd-fade-out');
		}
	});

	$back_to_top.on('click', function(event){
		event.preventDefault();
		$('body,html').animate({
			scrollTop: 0 ,
		 	}, scroll_top_duration
		);
	});

};


//#############################
// ---------- ANIMATIONS ----------
//#############################

AOS.init({
  duration: 1300,
})

function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + 31536000000); //1 year  
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}  