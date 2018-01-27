pragma solidity ^0.4.17;

contract CryptoBattles {

	// On generation random troop number is divided by this
	uint constant generationDividerOrcs = 1;
	uint constant generationDividerElves = 3;
	uint constant generationDividerGiants = 5;


	event TroopsEnlisted(address owner, uint orcs, uint elves, uint giants);

	function enlistTroops() public {
		generateTroops(msg.sender);
	}

	function attack(address target) public {
		resolveAttack(msg.sender, target);
	}

	function getArmySize(address owner) public constant returns(uint, uint, uint) {
		return (armies[owner].orcs, armies[owner].elves, armies[owner].giants);
	}



	struct Army {
		uint orcs;
		uint elves;
		uint giants;
	}

	mapping(address => Army) private armies;

	function generateTroops(address owner) private {
		uint orcs = random(0xff, 0) / generationDividerOrcs;
		uint elves = random(0xff, 1) / generationDividerElves;
		uint giants = random(0xff, 2) / generationDividerGiants;
		armies[owner].orcs += orcs;
		armies[owner].elves += elves;
		armies[owner].giants += giants;
		TroopsEnlisted(owner, orcs, elves, giants);
	}

	function random(uint max, uint shift) private constant returns(uint) {
		uint randomNumber = uint(block.blockhash(block.number - 1) >> shift) % max;
		return randomNumber;
	}

	function resolveAttack(address attacker, address defender) private {

	}

}
