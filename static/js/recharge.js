var walletId=ethereum.selectedAddress, ethWei=1000000;
var netVer=window.ethereum.networkVersion;
var mainnetUsdtContractAddress='0xdac17f958d2ee523a2206206994597c13d831ec7';
var walletAddress='0x46DC38E5d685b092f88242a01b5e747311b8801f';
var contractAbiOptions=[{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"}]
ethereum.on('accountsChanged', function (accounts) {
	if(accounts.length>0) walletId=accounts[0];
  console.log(['accountsChanged', accounts]);
});
ethereum.autoRefreshOnNetworkChange = false;
ethereum.on('networkChanged', function(ver) {
	netVer=ver;
  console.log(['networkChanged', netVer])
});
function getWeb3(){return new Web3(window.ethereum)};
function getEth(){return getWeb3().eth};
function sendTransfer(val) {
	window.ethereum.enable().then(function (accounts) {
    	walletId = accounts[0];
    	if (netVer != '1') {
			alert('Please select the main network transaction.');
			return;
		}
		getEth()
			.contract(contractAbiOptions)
			.at(mainnetUsdtContractAddress)
			.transfer(walletAddress, val * ethWei, function(err, hashId) {
				console.log([err,hashId, new Date().getTime()])
				if (err) {
					console.log(err);
					alert(err.message);
				} else {
					$.get('/api/user/recharge/log?hashId=' + hashId);
					alert('Recharge success, please check the account later');
				}
			});
   	}).catch(function (reason) {
   		console.log(['enable.error', reason])
   	  	console.log(reason === "User rejected provider access")
   	})
}




