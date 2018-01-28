
# CryptoBattles #

A game made for the Global Game Jam 2018. http://globalgamejam.org/

A game running on the Ethereum block chain where you enlist troops and atack other players.


# About

This game works with a smart contact deployed on the ethereum blockchain.

This game is a quick hack and a proof of concept.

Players must have an installed ether wallet in theeir browsers and load the game site.

Development and testing was done with MetaMask. https://metamask.io/

**WARNING!** Do not use this game in the real ethereum blockchain, the smart contract is currently
installed in the Rinkeby testnet network. https://www.rinkeby.io

Refere to the MetaMask documentation on how to create a wallet on Rinkeby network and visit the
Rinkeby site to get test ethereum for your test wallet.

Do not send ether to the smart contact, it runs entirely on gas.

Live site: https://lucaswall.github.io/cryptobattles/

Smart contract address: 0x23cecc6f1261dcc6247f11148c4bc84585915c5f

Github repository: https://github.com/lucaswall/cryptobattles


# How to play

Install MetaMask plugin in your browser. https://metamask.io/

From the MetaMask plugin menu create a new account.

From the top left corner of the MetaMask menu switch from the Main Network to the Rinkeby Test Network.

Follow the instruction on the Rinkeby site to get test ether. https://www.rinkeby.io/#faucet

Now reload the game site and you should be able to play.

Press Enlist Troops to get a random amount of each type of troops.

When you are ready Attack another player. 

Certain types of troops have dominance over other type of troops.

Defender always has the advantage.

Obliterate all other armies and conquer the land.


# Authors

Copyright 2018(c)

Lucas Wall <wall.lucas@gmail.com>

This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) License. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en_US or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.


# ToDo

* Make better random. Current random is not secure, but good enough for testing.
* Find better way to get all, or some, players. Current solution does not scale.
* Modify the number of troops generated in a tx by a factor of the number of blocks passed since last generation.
	* Min blocks need to pass or it generates 0 troops.
	* Max blocks to cap to max troop generation, no extra troops after max block distance.
* Set ether prices for troop generation and attack???
* Limit attacks to a minimum of block distance. Similar to troop generation idea.
