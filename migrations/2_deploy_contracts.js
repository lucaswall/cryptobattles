
var CryptoBattles = artifacts.require('./CryptoBattles.sol');

module.exports = function(deployer) {
	deployer.deploy(CryptoBattles);
}
