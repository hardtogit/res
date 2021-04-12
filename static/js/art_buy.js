var flopIndex = 0, flopGifts = [];
function gotoGiftShow(gift) {
	flopIndex = 0, flopGifts = gift;
	$('.payment-wait-dialog').hide();
	$(".open").css("display", "block");
	$(".start").css("display", "none");
}
function moreopen() {
	++flopIndex;
	if (flopGifts && flopIndex < flopGifts.length ) {
		$(".open").css("display", "block");
		$(".NFT").css("display", "none");
		$(".fanimg").removeClass('openCard');
		$(".left img").removeClass("openCard"); //添加翻牌动画
		$(".success").removeClass("reback"); //添加翻牌动画
		$(".USD").removeClass("reback3");
		$('.chip').hide();
		$('.success2').hide();
	} else {
		$(".fanimg,.success,.success2,.USD").removeClass('openCard reback reback2 reback3');
		$(".open,.NFT,.chip").hide();
		$(".start").show();
		flopGifts = [];
	}
}
// flopType=1 表示WAH奖励
// flopType=2 表示抽到作品
function artFlopAnmi() {
	var gift = flopGifts[flopIndex];
	if (gift.type == 1) {
		$(".left img").addClass("openCard"); //添加翻牌动画
		$(".success").addClass("reback"); //添加翻牌动画
		$(".USD").addClass("reback3").text(gift.wah);
		$(".open").css("display", "none");
		$(".NFT").css("display", "block");
	} else {
		$(".left img").addClass("openCard"); //添加翻牌动画
		$(".success2").addClass("reback2"); //添加翻牌动画
		$(".open").css("display", "none");
		$(".chip,.success2").css("display", "block");
		$('#prod-name').text(gift.name);
		$('#prod-number').text(gift.number);
		$('#prod-weght').text(gift.weght);
		$('#prod-mindon').text(gift.mindon);
		$('#prod-creator-image').attr('src', gift.creatorImageUrl);
		$('#prod-creator-name').text(gift.creator);
		$('.success2').attr('src',gift.imageUrl);
	}
}
function returnNotify(orderId,data) {
	$.ajax({
        url: '/api/payment/paypal/returnNotify', 
        type:'POST',
        contentType: "application/json; charset=utf-8",
        cache: false,
        dataType: "json",
        data: JSON.stringify(data),
        success: function(model) {
			if (model.message == 'OK' && model.errCode == 'OK') {
				queryGifts(orderId, model);
			} else {
				alert(model.message)
			}
        },
        error: function(err) {
			console.log(err);
 			alert(err.message);
        }
    })
}
function queryGifts(orderId, model) {
	var count = 60, Ot = 0;
	var pack=function() {
		--count;
		if (count == 0) return;
		$.get('/api/payment/gifts/' + orderId, function(data) {
			var gift=data.data,status=data.id;
			if (status == 1 && gift && gift.length > 0) {
				window.clearTimeout(Ot);
				gotoGiftShow(gift);
				return;
			} 
			Ot = window.setTimeout(pack, 3000);
		});
		
	};
	Ot = window.setTimeout(pack, 1000);
}
$("#payment-wallet").click(function(){
	$.ajax({
		type: 'POST',
		url: '/api/payment/checkout',
		data: {"total":num,"seriesId":seriesId, "type":50},
		success: function(model) {
			if (model.message == 'OK' && model.errCode == 'OK') {
				$('.payment-dialog').hide();
				$('.payment-wait-dialog').show();
				queryGifts(model.id, model);
			} else if (model.errCode=='order.code100004') {
				if (confirm('Insufficient balance - please add funds to your wallet.')) {
					top.location.href='/my/wallet.html'
				}
			} else {
				alert(model.message)
			}
        },
        error: function(err) {
			console.log(err);
 			alert(err.message);
        }
	})
});
/*paypal.Buttons({
    createOrder: function(data, actions) {
		var data = $.ajax({
			async: false,
			type: 'POST',
			url: '/api/payment/checkout',
			data: {"total":num,"seriesId":seriesId, "type":300}
		}).responseJSON;
		if (data.message !='OK') {
			alert(data.message);
			return null;
		}
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: data.data
                },
                custom_id: data.id
            }]
        })
    },
    onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
			var status=details.status,orderId=details.purchase_units[0].custom_id;
			if (status == "COMPLETED") {
				$('.payment-dialog').hide();
				$('.payment-wait-dialog').show();
				returnNotify(orderId, details);
			} else {
				alert('The deal failed.');
			}
			
        });
    }
}).render('#paypal-button-container');*/

