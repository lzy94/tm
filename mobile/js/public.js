(function() {
	//点击菜单，添加蒙版与显示菜单
	$(".header").on(".header-right", function() {
		$(".nav-menu").slideToggle();
		$(".nav-layer").toggle();
		$(".choose-address").hide();
	});
	$(".header").on("touchstart", ".header-right", function() {
		$(".nav-menu").slideToggle();
		$(".nav-layer").toggle();
		$(".choose-address").hide();
	});

	//在body上添加蒙版
	var udfLayer = '<div class="nav-layer"></div>'
	$("body").append(udfLayer);
	//菜单点击蒙版，收起菜单隐藏蒙版
	$(".nav-layer").on("touchstart", function() {
		$(this).hide();
		$(".nav-menu").slideUp();
		$(".home-popup").fadeOut()
		$(".public-home").show();
		setTimeout(function() {
			$(".public-home").css("opacity", "0.5")
		}, 5000);
	});
	//分页
	$(".page-box a").click(function() {
		$(".page-box a").removeClass("on")
		$(this).addClass("on")
	})
	$("#submit-btn").click(function() {
		var val = $("#form").serializeArray();
		val[0].value = '姓名：' + val[0].value + '--来自手机新专利页面--'+$('#local').val()+'：' + $('#applyname').val();
		dataSub(val, "立即提交", $(this))
	})

})(jQuery)

function dataSub(a, c, b) {
	a[0].value ? a[1].value ? $.ajax({
		type: "post",
		url: "http://www.qyxdd.com/message.php",
		async: !0,
		data: a,
		crossDomain: !0,
		dataType: "json",
		beforeSend: function() {
			b.text("正在提交······")
		},
		success: function(a) {},
		complete: function() {
			b.text(c);
			alert("留言提交成功！我们会尽快与您取得联系，请耐心等待。")
		}
	}) : alert("请填写电话号码") : alert("请填写名称")
};