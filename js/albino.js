/* 
	www.albinotonnina.com
	*/
	'use strict';


	var Site;
	Site = {};
	Site.queue = [];
	Site.timing = {};
	Site.scenes = {};
	Site.options = {};
	Site.skrollr = {};
	Site.cache = {};
	Site.isHidden = true;
	Site.subscriptions = {};
	Site.trackingAccount = 'UA-265680-29';
	Site.defaults = {
		mobileDeceleration: 0.1,
		scale: 1,
		smoothScrollingDuration: 200,
		smoothScrolling: true
	};





	Site.ajax = function(url, data, datatype, success, failure) {
		$.ajax({
			type: 'get',
			url: url,
			data: data,
			dataType: datatype,
			success: function(data) {

				success(data);
			},
			error: function(request, status, error) {

				failure(request, status, error);
			}
		});
	};

	Site.resize = function() {

		var windowWidth = $(window).innerWidth();
		var windowHeight = $(window).innerHeight();
		var windowAspectRatio = windowWidth / windowHeight;
		var viewBox = {
			width: 1024,
			height: 768
		};
		var bBox = {
			width: 3 * viewBox.width,
			height: 3 * viewBox.height
		};

		var maxHeight = viewBox.height / viewBox.width * windowWidth;
		if (windowHeight > maxHeight) {
			Site.show(true);
		} else {


			if (skrollr.get()) {
				Site.unhide();
			}


		}

		var maxAspectRatio = bBox.width / viewBox.height;
		var minAspectRatio = viewBox.width / bBox.height;
		var viewBoxRatio = viewBox.width / viewBox.height;

		$('[data-scene] svg').each(function() {
			var $svg = $(this);
			if (windowAspectRatio > maxAspectRatio) {
				$svg.attr({
					width: windowWidth,
					height: windowWidth / maxAspectRatio
				});
			} else if (windowAspectRatio < minAspectRatio) {
				$svg.attr({
					width: minAspectRatio * windowHeight,
					height: windowHeight
				});
			} else {
				$svg.attr({
					width: windowWidth,
					height: windowHeight
				});
			}
		});

		viewBox = {
			width: 1024,
			height: 60
		};
		bBox = {
			width: 3 * viewBox.width,
			height: 3 * viewBox.height
		};

		maxAspectRatio = (bBox.width / (viewBox.height));
		minAspectRatio = viewBox.width / (bBox.height - 768);
		viewBoxRatio = viewBox.width / viewBox.height;


	$('nav svg').each(function() {
		var $svg = $(this);


		var attrs;
		if (windowAspectRatio > maxAspectRatio) {
			attrs = {
				width: windowWidth,
				height: windowWidth / maxAspectRatio
			};
			$svg.attr(attrs);
			$('nav').css(attrs);
		} else if (windowAspectRatio < minAspectRatio) {
			attrs = {
				width: minAspectRatio * windowHeight,
				height: (windowHeight * 60) / 768
			};
			$svg.attr(attrs);
			$('nav').css(attrs);
		} else {
			attrs = {
				width: windowWidth,
				height: (windowHeight * 60) / 768
			};
			$svg.attr(attrs);
			$('nav').css(attrs);
		}
	});


};

Site.addLoader = function() {
	var site = document.createElement('figure');
	$(site).attr('role', 'site').css('display','block');
	$('body').append(site);
	

	// var loader = document.createElement('figure');
	// $(loader).attr('role', 'loader');
	// $('body').append(loader);
	// var spinner = document.createElement('div');
	// $(spinner).attr('class', 'spinner');
	// $(loader).append(spinner);
};

Site.buildScenes = function(obj) {


	$(document.head).append(
		$('<link/>')
		.attr({
			'data-skrollr-stylesheet': true,
			type: 'text/css',
			rel: 'stylesheet',
			href: 'css/animation.css'
		})
		);

	$('figure[role=site]').append('<nav/>');
	Site.ajax('svg/menu/scene.svg', {}, 'html', function(data) {
		$('nav').append(data);
	});
	// $('figure[role=site]').append('<div id="videoPlayer" />');
	if (!Site.isMobile()) {
		$('aside').append('<h3><a id="reopen" href="#">Re-open full version</a></h3>');
	}
	
	// var debug = document.createElement('div');
	// $(debug).attr('class', 'debug');
	// $('figure[role=site]').append(debug);
	// var vignette = document.createElement('div');
	// $(vignette).attr('class', 'vignette');
	// $('figure[role=site]').append(vignette);
	
	var sc = 1;
	for (var key in obj) {
		var scene = document.createElement('div');
		$(scene).attr('data-scene', key);
		$(scene).attr('id', 'scene' + sc);
		$('figure[role=site]').append(scene);
		sc++;
	}

};

Site.loadScene = function(element, callback) {
	var $element = $(element);
	var name = $element.data('scene');
	Site.ajax('svg/' + name + '/scene.svg', {}, 'html', function(data) {
		$element.append(data);
		if (Site.scenes[name] && Site.scenes[name].easing) {
			$.extend(options, Site.scenes[name]);
		}
		callback();
	}, function(request, status, error) {
		console.log(error);
	});
};

Site.clickEvents = function() {
	$('#autoBtn').bind('click', function() {
		Site.skrollr.animateTo(36000,{duration: 46000});
	});
	$('#topBtn').bind('click', function() {
		Site.skrollr.animateTo(0,{duration: 100});
	});
	
}

Site.framecount = function() {
	$('.debug').html(window.scrollY / this.defaults.scale + '<br>' + (window.scrollY + window.innerHeight) / this.defaults.scale);
};
Site.time = function(obj, timing) {
	if (obj.curTop <= timing.begin * Site.defaults.scale) {
		return 0;
	}
	if (obj.curTop >= timing.end * Site.defaults.scale) {
		return 1;
	}
	return (obj.curTop - timing.begin * Site.defaults.scale) / timing.duration * Site.defaults.scale;
};
Site.removeMe = function() {
	move('figure[role=site]')
	.set('opacity', 0)
	.end(function() {
		$('figure[role=site]').html('');
		$('body').css('height', 'auto').removeClass('this').addClass('myresume');
		$('body > div').fadeIn('300', function() {
			Site.skrollr.destroy();
			$('html,body').css('overflow-y', 'scroll');
		});
	});
};

// Site.activateCvLink = function() {
// 	move('#scrolldown')
// 		.delay('1s')
// 		.set('opacity', 1)
// 		.end(function() {
// 			move('#viewresume')
// 				.set('opacity', 1)
// 				.end();
// 		});
// };
// Site.movetheThing = function() {
// 	var pos = $('#scrollthing').position();
// 	var group = document.getElementById('scrollthing').getBoundingClientRect();
// 	move('#scrollthing')
// 		.x($(window).innerWidth() - pos.left - group.width - 50)
// 		.y(Math.abs(pos.top) + 50)
// 		.delay('2s')
// 		.end(function() {
// 			move('#cursor')
// 				.duration(800)
// 				.translate(45, 0)
// 				.end(function() {
// 					move('#moving')
// 						.duration(800)
// 						.translate(0, 50)
// 						.then()
// 						.duration(800)
// 						.translate(0, 25)
// 						.then()
// 						.translate(0, -50)
// 						.duration(800)
// 						.pop()
// 						.pop()
// 						.end();
// 				});
// 		});
// };


Site.hide = function(soft) {
	Site.isHidden = true;
	$('figure[role=site]').hide('400', function() {
		$('html,body').css('overflow-y', 'auto');
		$('body').css('height', 'auto').removeClass('this').addClass('myresume');
		$('body > div').fadeIn();

		if (!soft) {
			Site.skrollr.destroy();
			$('html, body').animate({
				scrollTop: 0
			}, 400);

		}



	});
};

Site.show = function(callback) {
	$('html, body').css('overflow-y', 'scroll').animate({

		scrollTop: 0

	}, 400, function() {
		if (Site.isHidden) {
			$('figure[role=site]').show('400', function() {
				$('body').removeClass('myresume').removeClass('it').addClass('this');
				Site.isHidden = false;
				if (skrollr.get()) {
					Site.skrollr.refresh();
				} else {
					Site.initSkrollr();
				}
			});
			if (callback) {
				// callback();
			}
		}
	});
};


Site.unhide = function() {
	if (Site.isHidden) {
		$('figure[role=site]').show('400', function() {

			$('body').removeClass('myresume').removeClass('it').addClass('this');
			Site.isHidden = false;
			if (skrollr.get()) {
				Site.skrollr.refresh();
			} else {
				Site.initSkrollr();
			}



		});

	}
};


Site.isIE = function() {
	var myNav = navigator.userAgent.toLowerCase();
	return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1]) : false;
};
Site.isMobile = function() {
	return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
};
Site.initSkrollr = function() {
	var renderTimeout;
	$.extend(Site.options, Site.defaults, {
		render: function(obj) {
			if (renderTimeout) {
				clearTimeout(renderTimeout);
			}
			renderTimeout = setTimeout(function() {
				for (var name in Site.scenes) {
					if (typeof Site.scenes[name].render === 'function') {

						var pos = Site.time(obj, Site.timing[name] || {
							begin: 0,
							end: 1
						});
						Site.scenes[name].render(pos, obj);
					}
				}
			}, 1);
		}
	});
	Site.skrollr = skrollr.init(Site.options);
	skrollr.menu.init(Site.skrollr, {
		animate: true,
		easing: 'swing',
		scenes: Site.timing,
		scale: 1,
		duration: function(currentTop, targetTop) {
			return Math.abs(currentTop - targetTop) * 0.2;
		}
	});
};

Site.init = function() {
	
	
	if (0) {
		Site.hide();
	} else {
		$.scrollDepth();
		if (Site.isIE()) {
			$('.vignette').passThrough('.box');
		}

		Site.addLoader();
		Site.ajax('svg/timing.json', {}, 'json', function(data) {
			var begin = 0;
			for (var scene in data) {
				begin += data[scene].offset;
				data[scene].begin = begin;
				data[scene].end = begin + data[scene].duration;
				begin += data[scene].duration;
			}
			Site.timing = data;
			
			Site.buildScenes(Site.timing);
			async.each($('[data-scene]'), Site.loadScene, function() {


				$(document.head).append($('<script/>', {
					src: 'js/skrollr.js'
				}));

				$('body').append(
					$('<script/>')
					.attr({
						src: 'js/skrollr.stylesheets.js'
					}));
				Site.clickEvents();
				Site.resize();
				Site.initSkrollr();
				$('body > div,figure[role=loader]').fadeOut('300', function() {});
				Site.show();
				// Site.show(function() {
				// 		Site.movetheThing();
				// 		Site.activateCvLink();
				// 	});
		});
		}, function() {
			Site.hide();
		});
	}
};


/*
Events
*/

// jQuery(window).unload(function() {
// 	Site.removeMe();
// });
jQuery(window).resize(function() {
	Site.resize();
});
jQuery(window).scroll(function() {
	Site.framecount();
});
jQuery(document).ready(function(){
	Site.init();
	
});
window.onload = function() {
	setTimeout(function() {
		window.scrollTo(0, -1);
	}, 0);
	
};


$.fn.passThrough = function(target) {
	var $target = $(target);
	return this.each(function() {
		var style = this.style;
		if ('pointerEvents' in style) {
			style.pointerEvents = style.userSelect = style.touchCallout = 'none';
		} else {
			$(this).on('click tap mousedown mouseup mouseenter mouseleave', function(e) {
				$target.each(function() {
					var rect = this.getBoundingClientRect();
					if (e.pageX > rect.left && e.pageX < rect.right &&
						e.pageY > rect.top && e.pageY < rect.bottom) {
						$(this).trigger(e.type);
				}

			});
			});
		}
	});

};




