 $(function(){
	
	$(window).scroll(function(){
		
		var HEIGHT = $(window).scrollTop() + $(window).innerHeight()-70;
		
		if( $(window).scrollTop() > 200 ){
			
			$("#top").stop().animate({top:HEIGHT});
			
		}else{
			
			$("#top").stop().animate({top:-95});
			
		}
		
	});
	
	$("#tOP").click(function goTop(){
		
		$("html,body").animate({scrollTop:0},1000);
		
	});
		 
 });