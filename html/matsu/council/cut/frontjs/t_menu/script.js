$(function () {
    //第一層選單Hover
    $("#t_menu > li").hover(function () {
        $(this).children("ul").stop(true, true).slideDown('200', 'easeOutQuart');
        $(this).children("a").addClass("keep");

    }, function () {
        $(this).children("ul").stop(true, true).slideUp('200', 'easeOutQuart');
        $(this).children("a").removeClass("keep");

        //removeClass delay用法
        $(this).children("a").addClass("keep2")
                       .delay(200)
                       .queue(function () {
                           $(this).removeClass("keep2");
                           $(this).dequeue();
                       });

        //        $(this).children("a").animate({
        //            'background-color': 'rgba(0,0,0,0)',
        //            'color':'#333333'
        //        }, 500, function () {
        //            // Animation complete.
        //        });

    }); //end hover


    //第二層選單之後Hover
    $("#t_menu ul li").hover(function () {
        $(this).children("ul").stop(true, true).slideDown('200', 'easeOutQuart');
        $(this).children("a").css({
            'background-color': 'rgba(68,68,68,0.8)'
        });
    }, function () {
        $(this).children("ul").stop(true, true).slideUp('200', 'easeOutQuart');
        $(this).children("a").css({
            'background-color': 'rgba(0,0,0,0.9)'
        });
    }); //end hover
	
	$("#t_menu > li ul li:has(ul) > a").append('<div class="arrow-right"><img src="js/t_menu/icon_triangle.png" /></div>');
	
	
	//鍵盤操作
	$("#t_menu > li").focusin(function(){ 
		$("#t_menu > li").not($(this)).children("a").removeClass("keep");
		$("#t_menu > li").not($(this)).children("ul").stop(true, true).slideUp();
		if(!$(this).children("a").hasClass("keep")){
			$(this).children("a").addClass("keep");
		$(this).children("ul").stop(true, true).slideDown();
		}
	});
	
	$("#t_menu > li").keydown(function(){ 
		if(event.keyCode == 13){tmenugotonewpage($(this));}
	});
	
	$("#t_menu ul li").keydown(function(){ 
		if(event.keyCode == 13){tmenugotonewpage($(this));}
	});
	
	function tmenugotonewpage(obj){
		var amenuhref = obj.find("a").attr("href");
		var amenutarget = obj.find("a").attr("target");
		if(amenuhref!=""&&typeof(amenuhref)!="undefined"){
			if(amenutarget==""||typeof(amenutarget)=="undefined"){location.href=amenuhref;}
		}
		return false;
	}
	
});