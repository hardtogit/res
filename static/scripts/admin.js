function uploadfiles(m) {
	var P='<p class="loader"><svg viewBox="0 0 120 120" class="process"><circle class="process-inner-circle" cx="60" cy="60" r="30"/></svg></p>';
	var I='<img src="{url}" />';
	var V='<video src="{url}" muted="muted" preload="metadata"></video>';
	$(m).on('change', function(e) {
		var fd = new FormData(),target=$(e.currentTarget.parentNode),process=$(P).appendTo(target);
		fd.append('file', this.files[0]);
		$.ajax({
	        url: '/admin/uploader/image', 
	        type:'POST',
	        cache: false, 
	        processData: false,
	        contentType: false,
	        data: fd,
			xhr: function() {
				var X = new XMLHttpRequest();
                if (X.upload) {
                    X.upload.onprogress = function(e) {                            
                        var loaded = e.loaded,total = e.total;
                        var percent = Math.floor(100 * loaded / total);
                        console.log("已经上传了：" + percent);
                        //process.css("width", percent + '%');
						//if (percent >= 100) process.remove();
                    };
                }
                return X;
			},
	        success: function(model) {
				process.remove();
	        	if (model['errCode']=="OK") {
	        		var url=model.data[0],node=target.find('img,video').get(0);
					if (url.indexOf('.mp4') > 1) {
						if (node.tagName == 'IMG') {
							$(node).remove(),node=$(V).appendTo(target).get(0)
						}
					} else {
						if (node.tagName == 'VIDEO') {
							$(node).remove(),node=$(I).appendTo(target).get(0)
						}
					}
					node.src=url,target.find('input[type=hidden]').val(url);
	        	} else {
	        		alert(model.message);
	        	}
	        },
	        error: function(err) {
				process.remove();
	        	console.log(err);
	 			alert(err.message);
	        }
	    })
	})
}

$(function() {
	var url = top.location.href,naviList=document.getElementsByClassName('header-navibar');
	if (naviList.length <= 0) return;
	
	var navibar = naviList[0];
	for(var i = 0; i < navibar.children.length; i++) {
		var item = navibar.children.item(i);
		if (item.href == url) {
			item.className = 'active';
			break;
		}
	}
});