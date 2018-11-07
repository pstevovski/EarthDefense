# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
#### Added
* Modularizing main.js
#### Changed
* Refactoring ship movement
* Custom settings
* Keypress does not abort previous keypress
#### Removed

## Major Releases:
### v1.0.0 - Oct 29 2018
* Initial release!
* It does things!
* Pewpewpew!

## Minor Releases:
### [v1.0.9] - Nov 5 2018
#### Added
* Added option to restart game right away when the game has ended.
* Added support for multiple keys pressed at once
* Added settings menu where player can set custom controls and adjust music / sfx volume.
* Added option to mute all volume.
* Added support for "escape" key and clicking out of canvas to pause the game.
* Updated score system, now based on kills and then multiplied by a factor of time spent playing.
#### Changed
* Fixed interval values issue for booster / overheating restoration after the game was paused & then continued.
* Changed ship movement (from moving all the time to moving only on key press & hold).
* Fixed minor bug with timer.
* Fixed a bug where if user holds space key to shoot, it shoots multiple rockets and overheats.

### [v1.0.4] - Nov 1 2018
#### Added
* Added score multiplication based on how long game was played.
#### Changed
* Minor graphical update to health, shield and overheat display.
* Fixed bug where player runs out of screen while using booster.
---------------------
## All Changes:
### v1.1.0 - Nov 8 2018
### Added
* Level system for the ship
* Upgrades of weapons based on level system (needs polishing and rework)
* Option to teleport from top to bottom, and bottom to top, as escape posibilities to dodge enemies.
### Changed
* Changed required experience to level up the ship from 100 XP to 80 XP on the first level, after which levels follow: requiredXP * 2 for each following level.

### v.1.0.9 [HOTFIX] - Nov 6 2018
#### Changed
* Corrected ship movement, now supporting diagonal movement.

### v1.0.9 - Nov 5 2018
#### Added
* Added option to restart game right away when the game has ended.
#### Changed
* Fixed interval values issue for booster / overheating restoration after the game was paused & then continued.
* Fixed issue with marking shield as destroyed and THEN enabling the game to decrease ship HP on next hit.

### v1.0.8 - Nov 4 2018
#### Added
* Added support for multiple keys pressed at once.
#### Changed
* Changed ship movement (from moving all the time to moving only on key press & hold).

### v1.0.7 - Nov 4 2018
#### Added
* Added settings menu where player can set custom controls and adjust music / sfx volume.
* Added option to mute all volume.
#### Changed
* Fixed minor bug with timer.

### v1.0.6 - Nov 1 2018
#### Changed
* Updated CHANGELOG to comply with Semantic Versioning standards

### v1.0.5 - Nov 1 2018
#### Added
* Updated score system, now based on kills and then multiplied by a factor of time spent playing.
* Added support for "escape" key and clicking out of canvas to pause the game.
#### Changed
* Fixed a bug where if user holds space key to shoot, it shoots multiple rockets and overheats.

### [v1.0.4] - Nov 1 2018 - HOTFIX
#### Added
* Added logic to handle non-root installations of game (a la github.io)

### v1.0.4 - Nov 1 2018
#### Added
* Added score multiplication based on how long game was played.
#### Changed
* Minor graphical update to health, shield and overheat display.
* Fixed bug where player runs out of screen while using booster.

### v1.0.3 - Oct 31 2018
#### Added
* Added changelog
* Added versioning
* Added contributor info
#### Changed
* File restructure

### v1.0.2 - Oct 31 2018
#### Added
* Notification on new highscore
#### Changed
* Better overheat

### v1.0.1 - Oct 30 2018
#### Added
* Overheat bar added
#### Changed
* Refactoring and couple of bugs fixed.

### v1.0.0 - Oct 29 2018
* Initial release!
* It does things!
* Pewpewpew!

<!-- LINKS -->
<!-- RELEASES -->
[Unreleased]: https://github.com/karnthis/EarthDefense/compare/release-v1.0.4...HEAD
[1.0.4]: https://github.com/karnthis/EarthDefense/compare/release-v1.0.0...release-v1.0.4

<!-- ISSUES -->
[#10]: https://github.com/pecko95/EarthDefense/pull/10
[#8]: https://github.com/pecko95/EarthDefense/pull/8
[#7]: https://github.com/pecko95/EarthDefense/pull/7