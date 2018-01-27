(function($) {
"use strict";

var web3js;
var contractInstance;
var accountAddress;

var contractAddress = '0x487c86fab46a99ffb40b54c96079046c9814ef2d';
var contractAbi = [{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"getArmySize","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"enlistTroops","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"}],"name":"attack","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"orcs","type":"uint256"},{"indexed":false,"name":"elves","type":"uint256"},{"indexed":false,"name":"giants","type":"uint256"}],"name":"TroopsEnlisted","type":"event"}];

function updateProfile() {
	console.log('updating profile data');
	$('#infoAddress').text(accountAddress);
	contractInstance.getArmySize(accountAddress, function(err, result) {
		if (err) { console.error(err); return; }
		$('#countOrcs').text(result[0].toNumber());
		$('#countElves').text(result[1].toNumber());
		$('#countGiants').text(result[2].toNumber());
	});
}

function connectToNode() {
	if (typeof web3 !== 'undefined') {
		console.log('found web3 provider');
		web3js = new Web3(web3.currentProvider);
	} else {
		console.log('web3 provider not found! fallback to localhost node');
		web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	}
	//web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

function createContractInstance() {
	var CryptoBattleContract = web3js.eth.contract(contractAbi);
	contractInstance = CryptoBattleContract.at(contractAddress);
}

function trackEnlistTransaction(err, result) {
	if (err) { console.error(err); return; }
	if (!result.blockNumber) {
		web3js.eth.getTransaction(result.hash, trackEnlistTransaction);
		return;
	}
	console.log('enlist transaction ' + result.hash + ' no longer pending');
	updateProfile();
	$('#infoStatus').text('');
	$('#statusSection').collapse('hide');
	$('#runEnlist').prop('disabled', false);
}

$('#runRefresh').click(function(event) {
	console.log('run refresh');
	updateProfile();
});

$('#runEnlist').click(function(event) {
	console.log('run enlist');
	var callData = contractInstance.enlistTroops.getData();
	var params = {
		to: contractAddress,
		from: accountAddress,
		data: callData,
	};
	web3js.eth.sendTransaction(params, function(err, result) {
		if (err) { console.error(err); return; }
		console.log('enlist tx ' + result);
		$('#infoStatus').html('Enlisting troops [<a target="_blank" href="https://rinkeby.etherscan.io/tx/' + result + '">' + result + '</a>]');
		$('#statusSection').collapse('show');
		$('#runEnlist').prop('disabled', true);
		web3js.eth.getTransaction(result, trackEnlistTransaction);
	});
});

$(window).on('load', function() {
	console.log("loaded!");
	connectToNode();
	console.log('connected to node is ' + web3js.isConnected());
	console.log('running on network ' + web3js.version.network);
	accountAddress = web3js.eth.accounts[0];
	createContractInstance();
	updateProfile();
	contractInstance.TroopsEnlisted(function(err, result) {
		if (err) { console.error(err); return; }
		console.log(result);
		updateProfile();
	});
});

})(jQuery);
