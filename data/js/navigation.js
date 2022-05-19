jQuery(document).ready(function(){

	"use strict";
	
	// here all ready functions
	scroll();
    navigation();
	navigation_fixed();
	navigation_scrollspy();
	navigation_scroll_affix();    
});

function scroll() {
  "use strict";
  $(document).scroll(function () {
    var $nav = $(".navbar-fixed-top");
    $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
  });
};

// --------------------------------------------
// ---------------  NAVIGATION  ---------------
// --------------------------------------------
 
function navigation(){
};
    $.navigation = function(element, options){
 
        var defaults = {
            responsive: true,
            mobileBreakpoint: 992,
            showDuration: 300,
            hideDuration: 300,
            showDelayDuration: 0,
            hideDelayDuration: 0,
            submenuTrigger: "hover",
            effect: "fade",
            submenuIndicator: true,
			submenuIndicatorTrigger: false,
            hideSubWhenGoOut: true,
            visibleSubmenusOnMobile: false,
            overlay: true,
            overlayColor: "rgba(0, 0, 0, 0.7)",
            hidden: false,
			hiddenOnMobile: false,
            offCanvasSide: "left",
			offCanvasCloseButton: true,
			animationOnShow: "",
			animationOnHide: "",
			hideScrollBar: true,
            onInit: function() {},
			onLandscape: function() {},
			onPortrait: function() {},
            onShowOffCanvas: function() {},
            onHideOffCanvas: function() {}
        };
 
        var plugin = this,
            bigScreenFlag = Number.MAX_VALUE,
            smallScreenFlag = 1,
            clickTouchEvents = "click.nav touchstart.nav",
            hoverShowEvents = "mouseenter focusin",
            hoverHideEvents = "mouseleave focusout";
        plugin.settings = {};
        var $element = $(element), element = element;
        
        if($(element).find(".nav-search").length > 0){
            $(element).find(".nav-search").find("form").prepend("<span class='nav-search-close-button' tabindex='0'>&#10005;</span>");
        }
 
        plugin.init = function(){
            plugin.settings = $.extend({}, defaults, options);
			
			if(plugin.settings.offCanvasCloseButton){
				$(element).find(".nav-menus-wrapper").prepend("<span class='nav-menus-wrapper-close-button'>&#10005;</span>");
			}
            
            if(plugin.settings.offCanvasSide == "right"){
                $(element).find(".nav-menus-wrapper").addClass("nav-menus-wrapper-right");
            }
            
            if(plugin.settings.hidden){
                $(element).addClass("navigation-hidden");
                plugin.settings.mobileBreakpoint = 99999;
            }
            
            checkSubmenus();
            
            $(element).find(".nav-toggle").on("click touchstart", function(e){
                e.stopPropagation(); 
                e.preventDefault();
                plugin.showOffcanvas();
                if(options !== undefined){
                    plugin.callback("onShowOffCanvas");
                }
            });
            
            $(element).find(".nav-menus-wrapper-close-button").on("click touchstart", function(){
                plugin.hideOffcanvas();
                if(options !== undefined){
                    plugin.callback("onHideOffCanvas");
                }
            });         
 
            $(element).find(".nav-search-button, .nav-search-close-button").on("click touchstart keydown", function(e){
                e.stopPropagation(); 
                e.preventDefault();
				var code = e.keyCode || e.which;
				if(e.type === "click" || e.type === "touchstart" || (e.type === "keydown" && code == 13)){
					plugin.toggleSearch();
				}
				else{
					if(code == 9){
						$(e.target).blur();
					}
				}
            });
            
            $(window).resize(function(){
                plugin.initNavigationMode(windowWidth());
                fixSubmenuRightPosition();
				if(plugin.settings.hiddenOnMobile){
					hideNavbarPortrait();
				}
            });
            
            plugin.initNavigationMode(windowWidth());
			
			if(plugin.settings.hiddenOnMobile){
				hideNavbarPortrait();
			}
			
			if(plugin.settings.overlay){
                $(element).append("<div class='nav-overlay-panel'></div>");
			}
			
			if($(element).find(".megamenu-tabs").length > 0){
                activateTabs();
            }
            
            if(options !== undefined){
                plugin.callback("onInit");
            }
        };
		
		// reset submenus
		var resetSubmenus = function(){
			$(element).find(".nav-submenu").hide(0);
			$(element).find("li").removeClass("focus");
		};
        
        // check the existence of submenus/add indicators to them
        var checkSubmenus = function(){
            $(element).find("li").each(function(){
                if($(this).children(".nav-dropdown,.megamenu-panel").length > 0){
                    $(this).children(".nav-dropdown,.megamenu-panel").addClass("nav-submenu");
                    if(plugin.settings.submenuIndicator){
                        $(this).children("a").append(
                            "<span class='submenu-indicator'>" + 
                                "<span class='submenu-indicator-chevron'></span>" +
                            "</span>"
                        );
                    }
                }
            });
        };
		
		//hide navbar on portrait mode
		var hideNavbarPortrait = function(){
			if($(element).hasClass("navigation-portrait")){
				$(element).addClass("navigation-hidden");
			}
			else{
				$(element).removeClass("navigation-hidden");
			}
		};
        
        // show a submenu
        plugin.showSubmenu = function(parentItem, submenuEffect){
            if(windowWidth() > plugin.settings.mobileBreakpoint){
                $(element).find(".nav-search").find("form").fadeOut();
            }
            if(submenuEffect == "fade"){
                $(parentItem).children(".nav-submenu")
                    .stop(true, true)
                    .delay(plugin.settings.showDelayDuration)
                    .fadeIn(plugin.settings.showDuration)
					.removeClass(plugin.settings.animationOnHide)
					.addClass(plugin.settings.animationOnShow);
            }
            else{
                $(parentItem).children(".nav-submenu")
                    .stop(true, true)
                    .delay(plugin.settings.showDelayDuration)
                    .slideDown(plugin.settings.showDuration)
					.removeClass(plugin.settings.animationOnHide)
					.addClass(plugin.settings.animationOnShow);
            }
			$(parentItem).addClass("focus");
        };
        
        // hide a submenu
        plugin.hideSubmenu = function(parentItem, submenuEffect){
            if(submenuEffect == "fade"){
                $(parentItem).find(".nav-submenu")
                    .stop(true, true)
                    .delay(plugin.settings.hideDelayDuration)
                    .fadeOut(plugin.settings.hideDuration)
					.removeClass(plugin.settings.animationOnShow)
					.addClass(plugin.settings.animationOnHide);
            }
            else{
                $(parentItem).find(".nav-submenu")
                    .stop(true, true)
                    .delay(plugin.settings.hideDelayDuration)
                    .slideUp(plugin.settings.hideDuration)
					.removeClass(plugin.settings.animationOnShow)
					.addClass(plugin.settings.animationOnHide);
            }
			$(parentItem).removeClass("focus").find(".focus").removeClass("focus");
        };
        
        // show the overlay panel
        var showOverlay = function(){
			if(plugin.settings.hideScrollBar){
				$("body").addClass("no-scroll");
			}
            if(plugin.settings.overlay){
                $(element).find(".nav-overlay-panel")
                    .css("background-color", plugin.settings.overlayColor)
                    .fadeIn(300)
                    .on("click touchstart", function(){
                        plugin.hideOffcanvas();
                    });
            }
        };
        
        // hide the overlay panel
        var hideOverlay = function(){
			if(plugin.settings.hideScrollBar){
				$("body").removeClass("no-scroll");
			}
            if(plugin.settings.overlay){
                $(element).find(".nav-overlay-panel").fadeOut(400);
            }
        };
 
        // show offcanvas
        plugin.showOffcanvas = function(){
            showOverlay();
            if(plugin.settings.offCanvasSide == "left"){
                $(element).find(".nav-menus-wrapper").css("transition-property", "left").addClass("nav-menus-wrapper-open");
            }
            else{
                $(element).find(".nav-menus-wrapper").css("transition-property", "right").addClass("nav-menus-wrapper-open");
            }
        };
        
        // hide offcanvas 
        plugin.hideOffcanvas = function(){          
            $(element).find(".nav-menus-wrapper").removeClass("nav-menus-wrapper-open")
                .on("webkitTransitionEnd moztransitionend transitionend oTransitionEnd", function(){
                    $(element).find(".nav-menus-wrapper")
                        .css("transition-property", "none")
                        .off();
            });
            hideOverlay();
        };
        
        // toggle offcanvas
        plugin.toggleOffcanvas = function(){
            if(windowWidth() <= plugin.settings.mobileBreakpoint){
                if($(element).find(".nav-menus-wrapper").hasClass("nav-menus-wrapper-open")){
                    plugin.hideOffcanvas();
                    if(options !== undefined){
                        plugin.callback("onHideOffCanvas");
                    }
                }
                else{
                    plugin.showOffcanvas();
                    if(options !== undefined){
                        plugin.callback("onShowOffCanvas");
                    }
                }
            }
        };
        
        // show/hide the search form
        plugin.toggleSearch = function(){
            if($(element).find(".nav-search").find("form").css("display") == "none"){
                $(element).find(".nav-search").find("form").fadeIn(200);
				$(element).find(".nav-search").find("input").focus();
            }
            else{
                $(element).find(".nav-search").find("form").fadeOut(200);
				$(element).find(".nav-search").find("input").blur();
            }
        };
        
        // set the navigation mode and others configs
        plugin.initNavigationMode = function(screenWidth){
            if(plugin.settings.responsive){
                if(screenWidth <= plugin.settings.mobileBreakpoint && bigScreenFlag > plugin.settings.mobileBreakpoint){
                    $(element).addClass("navigation-portrait").removeClass("navigation-landscape");
                    portraitMode();
					if(options !== undefined){
						plugin.callback("onPortrait");
					}
                }
                if(screenWidth > plugin.settings.mobileBreakpoint && smallScreenFlag <= plugin.settings.mobileBreakpoint){
                    $(element).addClass("navigation-landscape").removeClass("navigation-portrait");
                    landscapeMode();
                    hideOverlay();
                    plugin.hideOffcanvas();
					if(options !== undefined){
						plugin.callback("onLandscape");
					}
                }
                bigScreenFlag = screenWidth;
                smallScreenFlag = screenWidth;
            }
            else{
				$(element).addClass("navigation-landscape");
                landscapeMode();
				if(options !== undefined){
					plugin.callback("onLandscape");
				}
            }
        };
        
         // hide submenus/form when click/touch outside
        var goOut = function(){
            $("html").on("click.body touchstart.body", function(e){
                if($(e.target).closest(".navigation").length === 0){
					$(element).find(".nav-submenu").fadeOut();
					$(element).find(".focus").removeClass("focus");
                    $(element).find(".nav-search").find("form").fadeOut();
                }
            });
        };
        
        // return the window's width
        var windowWidth = function(){
            return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        };
        
        // unbind events
        var unbindEvents = function(mode){
			if(mode == "landscape")
				$(element).find(".nav-menu").find("li, a").off(clickTouchEvents)
			else
                $(element).find(".nav-menu").find("li, a").off(hoverShowEvents).off(hoverHideEvents);
        };
        
        // fix submenu right position
        var fixSubmenuRightPosition = function(){
            if(windowWidth() > plugin.settings.mobileBreakpoint){
                var navWidth = $(element).outerWidth();
                $(element).find(".nav-menu").children("li").children(".nav-submenu").each(function(){
                    if($(this).parent().position().left + $(this).outerWidth() > navWidth){
                        $(this).css("right", 0);
                    }
                    else{
                        $(this).css("right", "auto");
                    }
                });
            }
        };
        
        // activate the tabs
        var activateTabs = function(){          
            function initTabs(tabs){
                var navs = $(tabs).children(".megamenu-tabs-nav").children("li");
                var panes = $(tabs).children(".megamenu-tabs-pane");
                $(navs).on("mouseenter.tabs click.tabs touchstart.tabs", function(e){
                    e.stopPropagation(); 
                    e.preventDefault();
                    $(navs).removeClass("active");
                    $(this).addClass("active");
                    $(panes).hide(0).removeClass("active");
                    $(panes[$(this).index()]).show(0).addClass("active");
                });
            }
            
            if($(element).find(".megamenu-tabs").length > 0){
                var navigationTabs = $(element).find(".megamenu-tabs");
                for(var i = 0; i < navigationTabs.length; i++){
                    initTabs(navigationTabs[i]);
                }
            }
        };
        
        // set the landscape mode
        var landscapeMode = function(){
            unbindEvents("landscape");
            resetSubmenus();
            if(navigator.userAgent.match(/Mobi/i) || navigator.maxTouchPoints > 0 || plugin.settings.submenuTrigger == "click"){
                $(element).find(".nav-menu, .nav-dropdown").children("li").children("a").on(clickTouchEvents, function(e){
                    plugin.hideSubmenu($(this).parent("li").siblings("li"), plugin.settings.effect);
                    $(this).closest(".nav-menu").siblings(".nav-menu").find(".nav-submenu").fadeOut(plugin.settings.hideDuration);
                    if($(this).siblings(".nav-submenu").length > 0){
                        e.stopPropagation(); 
                        e.preventDefault();
                        if($(this).siblings(".nav-submenu").css("display") == "none"){
                            plugin.showSubmenu($(this).parent("li"), plugin.settings.effect);
                            fixSubmenuRightPosition();
							return false; 
                        }
                        else{
                            plugin.hideSubmenu($(this).parent("li"), plugin.settings.effect);
                        }
                        if($(this).attr("target") === "_blank" || $(this).attr("target") === "blank"){
                            window.open($(this).attr("href"));
                        }
                        else{
							if($(this).attr("href") === "#" || $(this).attr("href") === "" || $(this).attr("href") === "javascript:void(0)"){
								return false;
							}
							else{
								window.location.href = $(this).attr("href");
							}
                        }
                    }
                });
            }
            else{
                $(element).find(".nav-menu").find("li").on(hoverShowEvents, function(){
                    plugin.showSubmenu(this,  plugin.settings.effect);
                    fixSubmenuRightPosition();
                }).on(hoverHideEvents, function(){
                    plugin.hideSubmenu(this, plugin.settings.effect);
                });
            }
			if(plugin.settings.hideSubWhenGoOut){
				goOut();
			}
        };
        
        // set the portrait mode
        var portraitMode = function(){
            unbindEvents("portrait");
            resetSubmenus();
            if(plugin.settings.visibleSubmenusOnMobile){
                $(element).find(".nav-submenu").show(0);
            }
            else{
                $(element).find(".submenu-indicator").removeClass("submenu-indicator-up");
                if(plugin.settings.submenuIndicator && plugin.settings.submenuIndicatorTrigger){
                    $(element).find(".submenu-indicator").on(clickTouchEvents, function(e){
                        e.stopPropagation(); 
                        e.preventDefault();
                        plugin.hideSubmenu($(this).parent("a").parent("li").siblings("li"), "slide");
						plugin.hideSubmenu($(this).closest(".nav-menu").siblings(".nav-menu").children("li"), "slide");
                        if($(this).parent("a").siblings(".nav-submenu").css("display") == "none"){
                            $(this).addClass("submenu-indicator-up");
                            $(this).parent("a").parent("li").siblings("li").find(".submenu-indicator").removeClass("submenu-indicator-up");
							$(this).closest(".nav-menu").siblings(".nav-menu").find(".submenu-indicator").removeClass("submenu-indicator-up");
                            plugin.showSubmenu($(this).parent("a").parent("li"), "slide");
                            return false; 
                        }
                        else{
                            $(this).parent("a").parent("li").find(".submenu-indicator").removeClass("submenu-indicator-up");
                            plugin.hideSubmenu($(this).parent("a").parent("li"), "slide");
                        }
                    });
                }
                else{
					$(element).find(".nav-menu, .nav-dropdown").children("li").children("a").each(function(){
						if($(this).siblings(".nav-submenu").length > 0){
							$(this).on(clickTouchEvents, function(e){
								e.stopPropagation(); 
								e.preventDefault();
								plugin.hideSubmenu($(this).parent("li").siblings("li"), plugin.settings.effect);
								plugin.hideSubmenu($(this).closest(".nav-menu").siblings(".nav-menu").children("li"), "slide");
								if($(this).siblings(".nav-submenu").css("display") == "none"){
									$(this).children(".submenu-indicator").addClass("submenu-indicator-up");
									$(this).parent("li").siblings("li").find(".submenu-indicator").removeClass("submenu-indicator-up");
									$(this).closest(".nav-menu").siblings(".nav-menu").find(".submenu-indicator").removeClass("submenu-indicator-up");
									plugin.showSubmenu($(this).parent("li"), "slide");
									return false; 
								}
								else{
									$(this).parent("li").find(".submenu-indicator").removeClass("submenu-indicator-up");
									plugin.hideSubmenu($(this).parent("li"), "slide");
								}
								if($(this).attr("target") === "_blank" || $(this).attr("target") === "blank"){
									window.open($(this).attr("href"));
								}
								else{
									if($(this).attr("href") === "#" || $(this).attr("href") === "" || $(this).attr("href") === "javascript:void(0)"){
										return false;
									}
									else{
										window.location.href = $(this).attr("href");
									}
								}
							});
						}
					});
                }
            }
        };
        
        plugin.callback = function(func) {
            if (options[func] !== undefined) {
                options[func].call(element);
            }
        };
 
        plugin.init();
 
    };
 
    $.fn.navigation = function(options){
        return this.each(function(){
            if (undefined === $(this).data("navigation")){
                var plugin = new $.navigation(this, options);
                $(this).data("navigation", plugin);
            }
        });
    };

// -------------------------------------------------
// ---------------  NAVIGATION FIXED ---------------
// -------------------------------------------------

function navigation_fixed() {
}
	$.fixed = function(element, options) {

        var defaults = {
            topSpace: 0,
			placeholder: true,
            onFixed: function() {},
			onStatic: function() {}
        }

        var plugin = this;
        plugin.settings = {}
        var $element = $(element),
            element = element;
		var wrapper, placeholder, wrapperTop;

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);
			
			$(element).wrap("<div class='navigation-fixed-wrapper'></div>").each(function(){
				wrapper = $(element).parent();
				if(plugin.settings.placeholder){
					$("<div class='navigation-fixed-placeholder'></div>").insertBefore(wrapper);
					$(".navigation-fixed-placeholder").css("height", $(wrapper).outerHeight());
					placeholder = $(".navigation-fixed-placeholder");
				}
			});

			wrapperTop = $(wrapper).offset().top;	
			
			if(wrapperTop <= plugin.settings.topSpace){
				toFixed();
			}
			else{
				$(window).on("scroll", function(){						
					if($(window).scrollTop() >= wrapperTop - plugin.settings.topSpace){
						if(!$(wrapper).hasClass("fixed"))
							toFixed();
					}
					else{
						if($(wrapper).hasClass("fixed"))
							toStatic();
					}
				});
			}			
			
			$(window).resize(function(){
				resizeNav();
				if(plugin.settings.placeholder){
					$(placeholder).css("height", $(wrapper).outerHeight());
				}
			})
			
			$(element).on("click touchstart", function(){
				resizeNav();
			});
        }
		
		var toFixed = function() {			
			$(wrapper).addClass("fixed");
			if(plugin.settings.placeholder){
				$(placeholder).addClass("visible");
			}
			resizeNav();
			
			if(options !== undefined){
				plugin.callback("onFixed");
			}
        }
		
		var toStatic = function() {
			$(wrapper).removeClass("fixed");
			if(plugin.settings.placeholder){
				$(placeholder).removeClass("visible");
			}
			
			if(options !== undefined){
				plugin.callback("onStatic");
			}
        }
		
		var resizeNav = function() {
            $(element).css("width", $(wrapper).parent().width());
			$(wrapper).css("top", plugin.settings.topSpace);
        }
		
		var detectIOS = function() {
			var userAgent = navigator.userAgent || navigator.vendor || window.opera;
			if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
				return true;
			}
			else{
				return false;
			}
		}
		
		plugin.callback = function(func) {
			if (options[func] !== undefined) {
				options[func].call(element);
			}
		}

        plugin.init();

    }

    $.fn.fixed = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('fixed')) {
                var plugin = new $.fixed(this, options);
                $(this).data('fixed', plugin);
            }
        });
    }

// ------------------------------------------------------
// ---------------  NAVIGATION SCROLLSPY ----------------
// ------------------------------------------------------	

function navigation_scrollspy() {
}
    // Add our plugin to fn
    $.fn.extend({

        // Scrollspy is the name of the plugin
        scrollspy: function (options) {

            // Define our defaults
            var defaults = {
                namespace: 'scrollspy',
                activeClass: 'active',
                scrollSpeed: 500,
                offset: 0,
                container: window,
				onChange: function(){},
				onExit: function(){}
            };

            // Add any overriden options to a new object
            options = $.extend({}, defaults, options);

            // Adds two numbers together
            var add = function (ex1, ex2) {
                return parseInt(ex1, 10) + parseInt(ex2, 10);
            }

            // Find our elements
            var findElements = function (links) {

                // Declare our array
                var elements = [];

                // Loop through the links
                for (var i = 0; i < links.length; i++) {

                    // Get our current link
                    var link = links[i];

                    // Get our hash
                    var hash = $(link).attr("href")
                        .toLowerCase()
                        .replace("/#", "")
                        .replace("/ru#", "").replace("/ru-ru#", "").replace("/ru-ua#", "")
                        .replace("/es#", "").replace("/es-br#", "").replace("/es-es#", "").replace("/es-pt#", "")
                        .replace("/ar#", "").replace("/ar-ar#", "").replace("/ar-ae#", "")
                        .replace("/us-mi#", "").replace("/us-en#", "")
                        .replace("/th-th#", "")
                        .replace("/ru-ua#", "")
                        .replace("/tr-tr#", "")
                        .replace("/jp-ja#", "")
                        .replace("/idn-en#", "").replace("/idnen#", "")
                        .replace("/in-in#", "").replace("/in-mb#", "")
                        .replace("/af-ng#", "").replace("/af-sa#", "").replace("/af-zw#", "")
                        .replace("/cn#", "").replace("/cn-cn#", "").replace("/cn-zh#", "").replace("/cn-tw#", "").replace("/cn-hk#", "")
                        .replace("/au-au#", "").replace("/au-nz#", "")
                        .replace("/eu-en#", "").replace("/eu-nl#", "").replace("/eu-de#", "").replace("/eu-eu#", "")
                        .replace("/en-eu#", "")
                        .replace("/af-gh#", "").replace("/eu-am#", "").replace("/eu-gw#", "").replace("/us-gw#", "").replace("/ru-gw#", "").replace("/ch-gw#", "");

                    // Store our hash as an element
                    var element = $(hash);

                    // If we have an element matching the hash
                    if (element.length > 0) {

                        // Get our offset
                        var top = Math.floor(element.offset().top),
                            bottom = top + Math.floor(element.outerHeight());

                        // Add to our array
                        elements.push({ element: element, hash: hash, top: top, bottom: bottom });
                    }                    
                }

                // Return our elements
                return elements;
            };

            // Find our link from a hash
            var findLink = function (links, hash) {

                // For each link
                for (var i = 0; i < links.length; i++) {

                    // Get our current link
                    var link = $(links[i]);

                    // If our hash matches the link href
                    if (link.attr("href") === hash) {

                        // Return the link
                        return link;
                    }
                }
            };

            // Reset classes on our elements
            var resetClasses = function (links) {

                // For each link
                for (var i = 0; i < links.length; i++) {

                    // Get our current link
                    var link = $(links[i]);

                    // Remove the active class
                    link.parent().removeClass(options.activeClass);
                }
            };

            // For each scrollspy instance
            return this.each(function () {

                // Declare our global variables
                var element = this,
                    container = $(options.container);
				
                // Get our objects
				var links = $(element).find(".nav-menu").find('[href*="#"]');

                // Loop through our links
                for (var i = 0; i < links.length; i++) {

                    // Get our current link
                    var link = links[i];

                    // Bind the click event
                    $(link).on("click", function (e) {

                        // Get our target
                        var target = $(this).attr("href")
                            .toLowerCase()
                            .replace("/#", "")
                            .replace("/ru#", "").replace("/ru-ru#", "").replace("/ru-ua#", "")
                            .replace("/es#", "").replace("/es-br#", "").replace("/es-es#", "").replace("/es-pt#", "")
                            .replace("/ar#", "").replace("/ar-ar#", "").replace("/ar-ae#", "")
                            .replace("/us-mi#", "").replace("/us-en#", "")
                            .replace("/th-th#", "")
                            .replace("/ru-ua#", "")
                            .replace("/tr-tr#", "")
                            .replace("/jp-ja#", "")
                            .replace("/idn-en#", "").replace("/idnen#", "")
                            .replace("/in-in#", "").replace("/in-mb#", "")
                            .replace("/af-ng#", "").replace("/af-sa#", "").replace("/af-zw#", "")
                            .replace("/cn#", "").replace("/cn-cn#", "").replace("/cn-zh#", "").replace("/cn-tw#", "").replace("/cn-hk#", "")
                            .replace("/au-au#", "").replace("/au-nz#", "")
                            .replace("/eu-en#", "").replace("/eu-nl#", "").replace("/eu-de#", "").replace("/eu-eu#", "")
                            .replace("/en-eu#", "")
                            .replace("/af-gh#", "").replace("/eu-am#", "").replace("/eu-gw#", "").replace("/us-gw#", "").replace("/ru-gw#", "").replace("/ch-gw#", "");
						
                            $target = $(target);

                        // If we have the element
                        if ($target.length > 0) {

                            // Get it's scroll position
                            var top = add($target.offset().top, options.offset);
                            
                            // Scroll to our position
                            $('html, body').animate({ scrollTop: top }, options.scrollSpeed);
                            
                            // Prevent our link
                            e.preventDefault();
                        }
                    });
                }

                // Get our elements
                var elements = findElements(links);
				
				$(window).resize(function() {
					elements = findElements(links);
				});
                
                // Add a listener to the window
                container.on('scroll.' + options.namespace, function () {
                    
                    // Get the position and store in an object
                    var position = {
                        top: add($(this).scrollTop(), Math.abs(options.offset)),
                        left: $(this).scrollLeft()
                    };

                    // Create a variable for our link
                    var link;

                    // Loop through our elements
                    for (var i = 0; i < elements.length; i++) {

                        // Get our current item
                        var current = elements[i];

                        // If we are within the boundries of our element
                        if (position.top >= current.top && position.top < current.bottom) {
                            
                            // get our element
                            var hash = current.hash;

                            // Get the link
                            link = findLink(links, hash);
                            
                            // If we have a link
                            if (link) {

                                // If we have an onChange function
                                if (options.onChange) {

                                    // Fire our onChange function 
                                    options.onChange(current.element, $(element), position);
                                }

                                // Reset the classes on all other link
                                resetClasses(links);

                                // Add our active link to our parent
                                link.parent().addClass(options.activeClass);

                                // break our loop 
                                break;
                            }
                        }
                    }

                    // If we don't have a link and we have a exit function
                    if (!link && options.onExit) {
                        
                        // Fire our onChange function 
                        options.onExit($(element), position);
                    }
                });

            });
        }
    });


// ------------------------------------------------------------
// ---------------  NAVIGATION SCROLL AFFIX -------------------
// ------------------------------------------------------------
function navigation_scroll_affix() {
 
}
    $("#navigation1").fixed();
        $("#navigation1").scrollspy({
            offset: -100
});

	$("#navigation1").navigation();
	
