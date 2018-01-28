
# CryptoBattles #

A game made for the Global Game Jam 2018. http://globalgamejam.org/




# Authors

Copyright 2018(c)

Lucas Wall <wall.lucas@gmail.com>

This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) License. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en_US or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.


# ToDo

* Balance the game! I need a game designer.
* Make better random. Current random is not secure, but good enough for testing.
* Find better way to get all, or some, players. Current solution does not scale.
* Make page work only on Rinkeby test network. https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#construction_worker-network-check
* Modify the number of troops generated in a tx by a factor of the number of blocks passed since last generation.
** Min blocks need to pass or it generates 0 troops.
** Max blocks to cap to max troop generation, no extra troops after max block distance.
* Set ether prices for troop generation and attack?
* Limit attacks to a minimum of block distance.
