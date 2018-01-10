var loop = function(){
	$(".digits").empty();
	$(".digits").count({
		image: "./imgs/digits.png",
		timerEnd: function(){
			swal({
				title: "时辰已到！",
				text: "是否重新计时？",
				showCancelButton: true,
				confirmButtonText: "是",
				cancelButtonText: "否",
				width: "400px"
			}).then((result) => {
				if (result.value) {
					loop();
				} else {

				}
			});		
		}
	});
}
loop();