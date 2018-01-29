pragma solidity ^0.4.17;

contract CryptoBattles {

	// On generation random troop number is divided by this
	uint constant generationDividerOrcs = 1;
	uint constant generationDividerElves = 3;
	uint constant generationDividerGiants = 5;

	uint constant minEnlistTime = 5 minutes;
	uint constant minAttackTime = 1 minutes;

	uint constant minEnlistBlocks = minEnlistTime / 15 seconds;
	uint constant minAttackBlocks = minAttackTime / 15 seconds;


	event TroopsEnlisted(address owner, uint orcs, uint elves, uint giants);
	event Attacked(address atttacker, address defender);

	function enlistTroops() public {
		require(block.number - armies[msg.sender].lastEnlistBlk >= minEnlistBlocks);
		generateTroops(msg.sender);
	}

	function attack(address target) public {
		require(block.number - armies[msg.sender].lastAttackBlk >= minAttackBlocks);
		resolveAttack(msg.sender, target);
	}

	function getArmySize(address owner) public constant returns(uint, uint, uint) {
		return (armies[owner].orcs, armies[owner].elves, armies[owner].giants);
	}

	function getPlayers() public constant returns(address[]) {
		return players;
	}

	function getMinEnlistBlocks() public pure returns(uint) {
		return minEnlistBlocks;
	}

	function getMinAttackBlocks() public pure returns(uint) {
		return minAttackBlocks;
	}

	function getLastEnlistBlock() public constant returns(uint) {
		return armies[msg.sender].lastEnlistBlk;
	}

	function getLastAttackBlock() public constant returns(uint) {
		return armies[msg.sender].lastAttackBlk;
	}



	struct Army {
		bool exists;
		uint orcs;
		uint elves;
		uint giants;
		uint lastEnlistBlk;
		uint lastAttackBlk;
	}

	mapping(address => Army) private armies;
	address[] private players;

	function generateTroops(address owner) private {
		armies[owner].lastEnlistBlk = block.number;
		uint orcs = random(0xff, 0) / generationDividerOrcs;
		uint elves = random(0xff, 1) / generationDividerElves;
		uint giants = random(0xff, 2) / generationDividerGiants;
		armies[owner].orcs += orcs;
		armies[owner].elves += elves;
		armies[owner].giants += giants;
		if (!armies[owner].exists) {
			players.push(owner);
		}
		armies[owner].exists = true;
		TroopsEnlisted(owner, orcs, elves, giants);
	}

	function random(uint max, uint shift) private constant returns(uint) {
		uint randomNumber = uint(block.blockhash(block.number - 1) >> shift) % max;
		return randomNumber;
	}

	function resolveAttack(address attacker, address defender) private {
		armies[attacker].lastAttackBlk = block.number;
		phaseAttack(attacker, defender);
		phaseDefend(attacker, defender);
		Attacked(attacker, defender);
	}

	function phaseDefend(address attacker, address defender) private {
		killOrcs(attacker, armies[defender].elves * 3);
		killElves(attacker, armies[defender].giants * 2);
		killGiants(attacker, armies[defender].orcs / 5);
	}

	function phaseAttack(address attacker, address defender) private {
		killOrcs(defender, armies[attacker].elves * 3);
		killElves(defender, armies[attacker].giants * 2);
		killGiants(defender, armies[attacker].orcs / 5);
	}

	function killOrcs(address owner, uint count) private {
		if (count < 0 ) {
			count = 0;
		}
		if (count > armies[owner].orcs ) {
			count = armies[owner].orcs;
		}
		armies[owner].orcs -= count;
	}

	function killElves(address owner, uint count) private {
		if (count < 0 ) {
			count = 0;
		}
		if (count > armies[owner].elves ) {
			count = armies[owner].elves;
		}
		armies[owner].elves -= count;
	}

	function killGiants(address owner, uint count) private {
		if (count < 0 ) {
			count = 0;
		}
		if (count > armies[owner].giants ) {
			count = armies[owner].giants;
		}
		armies[owner].giants -= count;
	}

}
