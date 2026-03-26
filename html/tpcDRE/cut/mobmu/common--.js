$(document).ready(function() {
	var $win = $(window),
			$pageWrap = $('.page-wrap'),
			$navPanel = $('.nav-panel'),
			$nav = $('#nav'),
			$navLi = $nav.find('li').data('status', 'open'),
			$searchPanel = $('.search-panel');

	function nav_reset() {
		$navLi.data('status', 'open').removeClass('open').find('.nav-second').hide();
	}

	$('#footer .top-button').on('click', function(e) {
		e.preventDefault();
		$('html, body').animate({ scrollTop: 0 }, 'slow');
	});

	// 平板翻轉 /*IE9 會出問題所以拿掉*/
	//$win.on('resize orientationchange', function(e) {
	//  $win.trigger('resize');
	//});

	// 主選單按鈕開合
	$('.nav-button').data('status', 'open').bind('click', function(e) {
		e.preventDefault();
		nav_reset();
		$searchPanel.removeClass('toggle');
		$('html, body').animate({ scrollTop: 0 }, 'slow');

		var $ele = $(this);
	  if ($ele.data('status') == 'open') {
	    $ele.data('status', 'close').find('.fa-bars').removeClass('fa-bars').addClass('fa-times');
	    $navPanel.addClass('toggle');
			$('.main-panel').addClass('toggle');
	  	$pageWrap.css('min-height', $navPanel.height() + 48);
	  } else {
	    $ele.data('status', 'open').find('.fa-times').removeClass('fa-times').addClass('fa-bars');
	    $navPanel.removeClass('toggle');
	  	$pageWrap.css('min-height', 'auto');
			$('.main-panel').removeClass('toggle');
	  }
	});
	// 20180601 點其他地方 主選單按鈕 關閉
	$("body > div.header > div > p").click(function(event) {
		event.preventDefault();
		nav_button_close();
	});
	$("body > div.container > div").click(function(event) {
		event.preventDefault();
		nav_button_close();
	});
	function nav_button_close() {

		
		nav_reset();
		$searchPanel.removeClass('toggle');
		//以下造成所有<a>點了都會GO TOP 
		//$('html, body').animate({ scrollTop: 0 }, 'slow');

		var $ele = $('.nav-button');

	    $ele.data('status', 'open').find('.fa-times').removeClass('fa-times').addClass('fa-bars');
	    $navPanel.removeClass('toggle');
	  	$pageWrap.css('min-height', 'auto');
		$('.main-panel').removeClass('toggle');

	}



	// 主選單若有第二層，加上箭頭樣式
	$navLi.each(function(){
		if($(this).find('.nav-second')[0]) {
			$(this).addClass('nav-first');
		}
	});
	// 主選單若有第三層，加上箭頭樣式
	$navLi.each(function(){
		if($(this).find('.nav-3')[0]) {
			$(this).addClass('nav-first');
		}
	});
	

	// 主選單第二層開合
	var num;
	$('#nav h2 > a').bind('click', function(e) {
		e.preventDefault();

		var $ele = $(this), $eleLi = $ele.parents('li');
		if($eleLi.find('.nav-second')[0]) {
			if ($eleLi.data('status') == 'open') {
		    $eleLi.data('status', 'close').addClass('open').find('.nav-second').show();
		   	$pageWrap.css('min-height', $('.nav-panel').height() + 48);
		   	num = $pageWrap.height();
		  } else {
		    $eleLi.data('status', 'open').removeClass('open').find('.nav-second').hide();
		    var $secondH = $eleLi.find('.nav-second').height() + 10;
		   	$pageWrap.css('min-height', num - $secondH);
		  }
		} else {
			location.href = $ele.attr('href');
		}
	});
	
	// 主選單第3層開合
	var num;

	$('#nav .reset li .nav-second .reset li > a').bind('click', function(e) {
		e.preventDefault();

		var $ele = $(this), $eleLi = $ele.parent('li');
		if($eleLi.find('.nav-3')[0]) {
			if ($eleLi.data('status') == 'open') {
		    $eleLi.data('status', 'close').addClass('open').find('.nav-3').show();
		   	$pageWrap.css('min-height', $('.nav-panel').height() + 48);
		   	num = $pageWrap.height();
		  } else {
		    $eleLi.data('status', 'open').removeClass('open').find('.nav-3').hide();
		    var $secondH = $eleLi.find('.nav-3').height() + 10;
		   	$pageWrap.css('min-height', num - $secondH);
		  }
		} else {
			location.href = $ele.attr('href');
		}
	});

	// 搜尋功能開合
	$('.search-button').bind('click', function(e) {
		e.preventDefault();
		nav_reset();
		$searchPanel.toggleClass('toggle');
		$('.main-panel').removeClass('toggle');
		$('.nav-button').data('status', 'open').find('.fa-times').removeClass('fa-times').addClass('fa-bars');
		$navPanel.removeClass('toggle');
		$pageWrap.css('min-height', 'auto');
	});

});

