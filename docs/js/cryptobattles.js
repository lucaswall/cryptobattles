(function($) {
"use strict";

var web3js;
var contractInstance;
var accountAddress;

var contractAddress = '0x2714d0b96c580ea170170343c4f3f7d3b8d5472b';
var contractAbi = [{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"getArmySize","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPlayers","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"enlistTroops","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"}],"name":"attack","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"orcs","type":"uint256"},{"indexed":false,"name":"elves","type":"uint256"},{"indexed":false,"name":"giants","type":"uint256"}],"name":"TroopsEnlisted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"atttacker","type":"address"},{"indexed":false,"name":"defender","type":"address"}],"name":"Attacked","type":"event"}];

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
	updatePlayerList();
	$('#infoStatus').text('');
	$('#statusSection').collapse('hide');
	$('#runEnlist').prop('disabled', false);
	$('#runAttack').prop('disabled', false);
}

function trackAttackTransaction(err, result) {
	if (err) { console.error(err); return; }
	if (!result.blockNumber) {
		web3js.eth.getTransaction(result.hash, trackAttackTransaction);
		return;
	}
	console.log('attack transaction ' + result.hash + ' no longer pending');
	updateProfile();
	updatePlayerList();
	$('#infoStatus').text('');
	$('#statusSection').collapse('hide');
	$('#runEnlist').prop('disabled', false);
	$('#runAttack').prop('disabled', false);
}

var players = [];
var playersIdx = 0;

function addPlayerInfo(err, result) {
	if (err) { console.error(err); return; }
	var countOrcs = result[0];
	var countElves = result[1];
	var countGiants = result[2];
	var targetPlayer = players[playersIdx];
	$('#playerList').append('<tr><td>'+targetPlayer+'</td><td>'+countOrcs+'</td><td>'+countElves+'</td><td>'+countGiants+'</td><td><button class="btn btn-primary" id="attack'+targetPlayer+'">ATTACK</button></td></tr>')
	$('#attack'+players[playersIdx]).click(function(event) {
		attackPlayer(targetPlayer);
	});
	playersIdx++;
	if (playersIdx < players.length) {
		contractInstance.getArmySize(players[playersIdx], addPlayerInfo);
	}
}

function updatePlayerList() {
	$('#playerList').empty();
	contractInstance.getPlayers(function(err, result) {
		if (err) { console.error(err); return; }
		players = result;
		if (players.length > 0) {
			playersIdx = 0;
			contractInstance.getArmySize(players[0], addPlayerInfo);
		}
	});
}

function attackPlayer(attackTarget) {
	if (attackTarget == accountAddress) {
		console.warn('should not attack self');
		return;
	}
	console.log('run attack on ' + attackTarget);
	$('#attackTarget').val(attackTarget);
	var callData = contractInstance.attack.getData(attackTarget);
	var params = {
		to: contractAddress,
		from: accountAddress,
		data: callData,
	};
	web3js.eth.sendTransaction(params, function(err, result) {
		if (err) { console.error(err); return; }
		console.log('attack tx ' + result);
		$('#infoStatus').html('Attacking '+attackTarget+' [<a target="_blank" href="https://rinkeby.etherscan.io/tx/' + result + '">' + result + '</a>]');
		$('#statusSection').collapse('show');
		$('#runEnlist').prop('disabled', true);
		$('#runAttack').prop('disabled', true);
		web3js.eth.getTransaction(result, trackEnlistTransaction);
	});
}

$('#runRefresh').click(function(event) {
	console.log('run refresh');
	updateProfile();
	updatePlayerList();
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

$('#runAttack').click(function(event) {
	var attackTarget = $('#attackTarget').val();
	attackPlayer(attackTarget);
});

$(window).on('load', function() {
	console.log("loaded!");
	connectToNode();
	console.log('connected to node is ' + web3js.isConnected());
	console.log('running on network ' + web3js.version.network);
	accountAddress = web3js.eth.accounts[0];
	createContractInstance();
	updateProfile();
	updatePlayerList();
	contractInstance.TroopsEnlisted(function(err, result) {
		if (err) { console.error(err); return; }
		console.log(result);
		updateProfile();
	});
	var accountInterval = setInterval(function() {
		if (web3.eth.accounts[0] !== accountAddress) {
			accountAddress = web3.eth.accounts[0];
			$('#attackTarget').val('');
			updateProfile();
		}
	}, 100);
});

})(jQuery);
