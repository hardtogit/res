function getWeb3() {
	return new Web3(window.ethereum)
}
function getEth() {
	return getWeb3().eth;
}
function log(a){
	var l=$('#logs');
	if(l.length>0){
		var m=JSON.stringify(a);
		console.log(a),l.append('<p>' + m + '</p>')
	}
};
var NFT = {
	UNILP_WEI:1000000000000000000,
	FMG_PER_EPOCH:250000,
	FMG_PRICE:0.39,
	VERSION:'20210330',
	APPROVE_AMOUNT:115792089237316195423570985008687907853269984665640564039457584007913,
	Authorized:false,isAllowance:false,
	Mainnet:{
		StakContractAddress:'0xd520c77d3cBaDEB0b4625ED067c3BC39D88015A6',
		YieldContractAddress:'0xCd7bd3dd61E6d957503758C6e666D48F19d4ee44',
		UniLPContractAddress:'0x8815ee66cBb8Fd7aDAf199cc5564EB2Ac52A9c00',
		AirdropContractAddress:'0xfB2bADe4Ab37C47705D6EA46959DE6E4A08E807A',
		FMGContractAddress:'0x2991341D28Eaea277785D20e1d878D478c7bA4C7'
	},
	init:function() {
		if (window.ethereum) {
			window.ethereum.enable().then(function(accounts){
				NFT.Authorized=true;
				NFT.initData(accounts[0])
			}).catch(function(er){
				alert(er.message)
			});
			
			ethereum.autoRefreshOnNetworkChange=false;
			ethereum.on('networkChanged', NFT.onNetworkChange);
		}
	},
	initData:function(account) {
		NFT.Staking.getCurrentEpoch(function(epochId){
			$('.total-wah-epoch-next').text(parseInt(epochId)+1);
			$('.total-wah-epoch').text(epochId);
			// 订单周期倒计时时间
			NFT.Staking.epochDuration(function(duration){
				NFT.Staking.epoch1Start(function(start){
					var total=(duration-(((new Date().getTime()/1000)-start)%duration));
					log(['initData.clockHeartbeat',total]);
					NFT.clockHeartbeat(total);
				})
			});
			NFT.Staking.getEpochUserBalance(epochId,function(data){
				var amount=NFT.FMG_PER_EPOCH*data;
				NFT.Staking.getEpochPoolSize(epochId,function(num){
					var sum=amount/num;
					$('.estimated-token-reward').text(sum)
				});
			});
		});
		
		NFT.YieldFarmLP.getTotalDistributedAmount(function(total){
			NFT.YieldFarmLP.nrOfEpochs(function(amount){
				$('.total-distributed-amount').text(total/amount)
			})
		});
		
		// max balance
		NFT.Staking.balanceOf(function(balance){
			$('.lp-tokens-deposited').text(balance/NFT.UNILP_WEI)
		},account);
		
		NFT.UniLPToken.balanceOf(account,function(balance){
			var total=balance/NFT.UNILP_WEI;
			$('.lp-tokens-balance').text(balance/NFT.UNILP_WEI);
			
		});
		NFT.Fmg.balanceOf(function(balance){
			var total=balance/NFT.UNILP_WEI;
			$.get('/api/mining/balanceOf?balance=' + total);
		});
		NFT.UniLPToken.balanceOf(NFT.Mainnet.StakContractAddress,function(balance){
			var b=balance/NFT.UNILP_WEI;
			var np=NFT.FMG_PER_EPOCH*NFT.FMG_PRICE*52*100/(b*50);
			$('.total-lp-tokens').text(b);
			$('.apy-mass-harvest').text(np.toFixed(2));
		});
		
		var allo=document.setCookie('isAllowance');
		if (allo == '1') {
			NFT.isAllowance=true;
			$('.deposit').text('Deposit')
		} else {
			NFT.UniLPToken.allowance(function(data){
				var min=10000;
				NFT.isAllowance=(data>min);
				if(data>min) $('.deposit').text('Deposit')
			});
		}
	},
	onNetworkChange:function(netVer) {
		if (netVer != '1') {
			alert('Please switch to the main network.');
		}
	},
	walletAccount:function() {
		return window.ethereum.selectedAddress;
	},
	clockID:0,
	clockHeartbeat:function(l){
		var timeGroup=$('.timebox_center .time span').toArray();
		clearTimeout(NFT.clockID);
		if (l == 0) return;
		var d1=86400,h1=3600,m1=60,sce=l;
		var fun=function(){
			var day=sce/d1,hour=(sce%d1)/h1,minute=parseInt(sce%d1%h1/m1);
			day=parseInt(day),hour=parseInt(hour);
			if (day <= 0){
				day='00';
			} else if (day < 10) {
				day='0'+day;
			}
			if (hour <= 0) {
				hour='00';
			} else if (hour < 10) {
				hour='0'+hour;
			}
			if (minute <= 0) {
				minute='00';
			} else if(minute < 10) {
				minute='0'+minute;
			}
			var timeString=day+hour+minute;
			for(var i=0;i<timeGroup.length;i++){
				timeGroup[i].innerHTML=timeString.charAt(i)
			}
			--sce;
			NFT.clockID=setTimeout(fun, 1000)
		};
		fun()
	},eth:function(f){
		if (!window.ethereum) {
			alert('Please connect your wallet on a desktop web browser.');
			return;
		}
		
		if (NFT.Authorized) {
			f(window.ethereum.selectedAddress);
			return;
		}
		
		window.ethereum.enable().then(function(accounts){
			NFT.Authorized=true,f(accounts[0]);
		}).catch(function(er){
			console.log(['nft.eth', er]);
			alert(er.message)
		})
	}
};
NFT.Fmg = {
	__at:null,
	__call:function(){
		var args=[],m=arguments[0];
		for(var i=1;i<arguments.length;i++) args.push(arguments[i]);
		NFT.eth(function(account){
			if (NFT.Fmg.__at) {
				var c=NFT.Fmg.__at[m];
				c.apply(c,args);
			} else {
				$.get('/static/json/abi_fmg.json?v=' + NFT.VERSION, function(abi){
					NFT.Fmg.__at=getEth().contract(abi).at(NFT.Mainnet.FMGContractAddress);
					var c=NFT.Fmg.__at[m];
					c.apply(c,args);
				})
			}
		})
	},
	balanceOf:function(cb,address){
		this.__call('balanceOf',(address||NFT.walletAccount()),function(er,balance){
			log(['Fmg.balanceOf', arguments]);
			if(!er){
				cb&&cb(balance)
			} else {
				alert(er.message)
			}
		})
	}
};
NFT.Airdrop = {
	__at:null,
	__call:function(){
		var args=[],m=arguments[0];
		for(var i=1;i<arguments.length;i++) args.push(arguments[i]);
		NFT.eth(function(account){
			if (NFT.Airdrop.__at) {
				var c=NFT.Airdrop.__at[m];
				c.apply(c,args);
			} else {
				$.get('/static/json/abi_airdrop.json?v=' + NFT.VERSION, function(abi){
					NFT.Airdrop.__at=getEth().contract(abi).at(NFT.Mainnet.AirdropContractAddress);
					var c=NFT.Airdrop.__at[m];
					c.apply(c,args);
				})
			}
		})
	},
	claim:function(i,a,m,p){
		this.__call('claim',i,a,m,p,function(){
			log(['claim',arguments]);
		})
	},
	isClaimed:function(index, cb){
		this.__call('isClaimed', index, function(er, flag){
			log(['isClaimed',arguments]);
			if (!er) {
				cb&&cb(flag)
			} else {
				alert(er.message)
			}
		})
	}
};
NFT.UniLPToken = {
	__at:null,
	__call:function() {
		var args=[],m=arguments[0];
		for(var i=1;i<arguments.length;i++) args.push(arguments[i]);
		NFT.eth(function(account){
			if (NFT.UniLPToken.__at) {
				var c=NFT.UniLPToken.__at[m];
				c.apply(c,args);
			} else {
				$.get('/static/json/abi_unilp_token.json?v=' + NFT.VERSION, function(abi){
					NFT.UniLPToken.__at=getEth().contract(abi).at(NFT.Mainnet.UniLPContractAddress);
					var c=NFT.UniLPToken.__at[m];
					c.apply(c,args);
				})
			}
		})
	},
	approve:function(cb,amount) {
		this.__call('approve',NFT.Mainnet.StakContractAddress, (amount||NFT.APPROVE_AMOUNT), function(er, txnHash){
			log(['approve',arguments]);
			if (!er) {
				cb&&cb(txnHash)
			} else {
				alert(er.message)
			}
		})
	},
	allowance:function(cb,eb) {
		this.__call('allowance',NFT.walletAccount(),NFT.Mainnet.StakContractAddress, function(er, data){
			log(['allowance',arguments]);
			if (!er) {
				cb&&cb(data)
			} else {
				if(eb){
					eb&&eb(er)
				} else {
					alert(er.message)
				}
			}
		})
	},
	balanceOf:function(address,cb){
		this.__call('balanceOf',address,function(er,balance){
			log(['UniLPToken.balanceOf',address ,arguments]);
			if(!er){
				cb&&cb(balance)
			} else {
				alert(er.message)
			}
		})
	}
};
NFT.Staking = {
	__at:null,
	__call:function(){
		var args=[],m=arguments[0];
		for(var i=1;i<arguments.length;i++) args.push(arguments[i]);
		NFT.eth(function(account){
			if (NFT.Staking.__at) {
				var c=NFT.Staking.__at[m];
				c.apply(c,args);
			} else {
				$.get('/static/json/abi_nft_staking.json?v=' + NFT.VERSION, function(abi){
					NFT.Staking.__at=getEth().contract(abi).at(NFT.Mainnet.StakContractAddress);
					var c=NFT.Staking.__at[m];
					c.apply(c,args);
				})
			}
		})
	},
	deposit:function(amount,cb,ce){
		var total=(amount*NFT.UNILP_WEI);
		this.__call('deposit',NFT.Mainnet.UniLPContractAddress,total,function(er,txnHash){
			log(['deposit',arguments]);
			if (!er) {
				cb&&cb(txnHash)
			} else {
				if (ce){
					ce(er)	
				} else {
					alert(er.message)
				}
			}
		})
	},
	withdraw:function(amount,cb){
		var total=(amount*NFT.UNILP_WEI);
		this.__call('withdraw',NFT.Mainnet.UniLPContractAddress,total,function(er, txnHash){
			log(['withdraw',arguments]);
			if (!er) {
				cb&&cb(txnHash)
			} else {
				alert(er.message)
			}
		})
	},
	// 返回一个int，表示目前第几个周期
	getCurrentEpoch:function(cb){
		// data={c:[0],e:0,s:1}
		this.__call('getCurrentEpoch',function(er, data){
			log(['Staking.getCurrentEpoch',arguments]);
			if (!er) {
				cb&&cb(data)
			} else {
				alert(er.message)
			}
		})
	},
	getEpochPoolSize:function(epochId,cb) {
		this.__call('getEpochPoolSize',NFT.Mainnet.UniLPContractAddress,epochId,function(er,ps){
			log(['getEpochPoolSize',arguments]);
			if (!er) {
				cb&&cb(ps)
			} else {
				alert(er.message)
			}
		})
	},
	// 表示单个周期时长
	epochDuration:function(cb){
		this.__call('epochDuration',function(er, data){
			log(['epochDuration',arguments]);
			if (!er) {
				cb&&cb(data)
			} else {
				alert(er.message)
			}
		})
	},
	// 表示周期1开始 的时间戳
	epoch1Start:function(cb){
		this.__call('epoch1Start',function(er, es){
			log(['epoch1Start',arguments]);
			if (!er) {
				cb&&cb(es)
			} else {
				alert(er.message)
			}
		})
	},
	balanceOf:function(cb, userAddress){
		this.__call('balanceOf',(userAddress||NFT.walletAccount()), NFT.Mainnet.UniLPContractAddress, function(er, balance){
			log(['Staking.balanceOf',arguments]);
			if(!er){
				cb&&cb(balance)
			} else {
				alert(er.message)
			}
		})
	},
	getEpochUserBalance:function(epochId,cb){
		this.__call('getEpochUserBalance', NFT.walletAccount(), NFT.Mainnet.UniLPContractAddress, epochId, function(er,b){
			log(['Staking.getEpochUserBalance',arguments]);
			if(!er){
				cb&&cb(b)
			} else {
				alert(er.message)
			}
		})
	}
	
};
NFT.YieldFarmLP = {
	__at:null,
	__call:function() {
		var args=[],m=arguments[0];
		for(var i=1;i<arguments.length;i++) args.push(arguments[i]);
		NFT.eth(function(account){
			if (NFT.UniLPToken.__at) {
				var c=NFT.YieldFarmLP.__at[m];
				c.apply(c,args);
			} else {
				$.get('/static/json/abi_yield_farm_lp.json?v=' + NFT.VERSION, function(abi){
					NFT.YieldFarmLP.__at=getEth().contract(abi).at(NFT.Mainnet.YieldContractAddress);
					var c=NFT.YieldFarmLP.__at[m];
					c.apply(c,args);
				})
			}
		})
	},
	getCurrentEpoch:function(cb){
		this.__call('getCurrentEpoch',function(er, epochId){
			log(['getCurrentEpoch',arguments]);
			if(!er){
				cb&&cb(epochId)
			} else {
				alert(er.message)
			}
		})
	},
	getPoolSize:function(epochId,cb){
		this.__call('getPoolSize',epochId,function(er, amount){
			log(['getPoolSize',arguments]);
			if(!er){
				cb&&cb(amount/NFT.UNILP_WEI)
			} else {
				alert(er.message)
			}
		})
	},
	massHarvest:function(cb){
		this.__call('massHarvest',function(er, txnHash){
			log(['massHarvest',arguments]);
			if(!er){
				if (cb){
					cb(txnHash)
				} else {
					alert('Claim Successful! Txh:' + txnHash)
				}
			} else {
				alert(er.message)
			}
		})
	},
	getEpochStake:function(userAddress,epochId,cb){
		this.__call('getEpochStake',userAddress,epochId,function(er, amount){
			log(['getEpochStake',arguments]);
			if(!er){
				cb&&cb(amount/NFT.UNILP_WEI)
			} else {
				alert(er.message)
			}
		})
	},
	getTotalDistributedAmount:function(cb){
		this.__call('TOTAL_DISTRIBUTED_AMOUNT',function(er, total){
			log(['TOTAL_DISTRIBUTED_AMOUNT',arguments]);
			if(!er){
				cb&&cb(total)
			} else {
				alert(er.message)
			}
		})
	},
	nrOfEpochs:function(cb) {
		this.__call('NR_OF_EPOCHS',function(er,amount){
			log(['NR_OF_EPOCHS',arguments]);
			if (!er) {
				cb&&cb(amount)
			} else {
				alert(er.message)
			}
		})
	},
	claimable:function(cb){
		this.__call('claimable',NFT.walletAccount(), function(er, num){
			log(['claimable',arguments]);
			if (!er) {
				cb&&cb(num/NFT.UNILP_WEI)
			} else {
				//alert(er.message)
			}
		})
	}
};



