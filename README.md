# Earth Defence
Defend the Earth from the upcoming meteors! (WIP).

* [x] Ship movement
* [x] Canvas boundaries
* [x] Collision spaceship-meteor
* [x] Shooting
* [x] After a while shooting causes performance drop - FIXED
* [x] Collision spaceship bullets - meteor
* [x] Explosion image at the place where the meteor was destroyed
* [x] Score
* [x] Ship hits meteor - destroy meteor and deduct 20 HP(ONCE!) from the spaceship
* [x] End game if ship HP reaches 0.
* [x] Add a randomly spawned HP restoration and restore ship's HP if it collects it.
* [x] Explosion image when ship hits meteor.
* [x] Custom ship HP and earth HP progress bars.
* [x] End game if Earth is destroyed (earth HP reaches 0).
* [x] Exit button at game over menu takes you to the main menu.
* [x] Fix meteors and HP restoration spawning off canvas heights.
* [x] Stop ship going off boundaries.
* [x] Merged meteor destruction by ammo and by ship.
* [x] Add a randomly spawned comet / larger meteor which upon destruction gives you 500 points.
* [x] If the comet hits the meteor or the ship, decrease the HP by 40.
* [x] Sounds for shooting and meteor destruction.
* [x] Corrected ship movement. Now the ship moves as long as you hold the key, when you release the direction key it stops.
* [x]  Game end because player died
* [x]  Game ends because earth is destroyed.
* [x]  Different game over menu (RIP if dead, noob if Earth is destroyed, good job if completed)
* [x]  When user reaches 3000 points & 6000 points, speed up the speed at which the meteors are incoming.
* [x]  More missiles to be up at the same time.
* [x]  Destroy missile (remove from screen) when it hits meteor / comet.
* [x]  Use a flag variable to hold the meteors and ship from moving untill message disappears.
* [x]  Pause / Continue game
* [x]  Display score and highscore on game end.
* [x]  Graphical Update to the assets (ship, background, rocket).
* [x]  Added notification for controls.
* [x]  Add notification when reaching a ceratin score (3000-6000-10 000) "Another disturbance in the Asteroid belt has launched the meteors even faster."
* [x]  Add gun over-heating if user spams shoot too much
* [x]  Display alien spaceship at 10k points
* [x]  Alien ship movement
* [x]  Rocekt/explosion detection on alien space ship decreasing HP by 10.
* [x]  Alien spaceship shooting rockets every 1s
* [x]  Alien rockets hitting Player spaceship, decreasing HP by 10.
* [x]  Display alien ship HP (200 HP) when alien spawns. 
* [x]  Add 1500 to the score when defeating the alien
* [x]  Add different game ending menu if the user beats the game.
* [x]  Fix issue with rocket firing at the start of the game.
* [x]  Comet spawns early bug.
* [x]  At certain points, meteors are swapped with Alien space ships that fire rockets.
* [x]  When alien spaceships ammo hit the players ship, decrease HP.
-------------------
* [ ]  At 10.000 points, swap meteors with tiny alien spaceships that will(?) fire rockets each 2 seconds AND add a timer - 1 min 30sec - which the user will have to survive before spawning the boss.
* [ ]  Add a timer (1 minute 30 seconds) at point where user starts dealing with alien ships
* [ ]  When timer runs out, spawn boss.
* [ ]  Adjust meteor speed after 6000 points.(?)
* [ ]  Clean code
* [ ]  Refactoring
* [ ]  Add media queries for 1080p, 1440p and 4k.
* [ ]  Canvas revamp (full window width and height?) ?
-------------------
###### Bugs:
* [ ]  Explosion image does not appears for every meteor hit. Sometimes it does, sometimes doesnt.
* [ ]  Player dies instantly when he hits the METEORS. When Alien spaceships are there instead of the meteors it works normal.