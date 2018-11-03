# WebGM

Web based version of Game Maker 8.

Live version: https://luizeldorado.github.io/webgm/index.html

## What's this?

Game Maker 8 is an old program where you could make Windows games in a simple but powerful way. Many people learned how to program and make games through this software. This project aims to recreate it in a web enviroment, so that it's free, open, and easy to access.

## What's the point of this??

Mainly nostalgia. But for me, personally, is to create a JavaScript game engine that's simple enough, not overcomplicated like the ones that are out there. However, making it the "right" way became too complicated. So a decided to replicate Game Maker, which I know a lot about, since it's much simpler and fundamentally flawed because of it.

## How to run

Download .zip or clone. Run index.html. Done.

## How can I contribute???

First, keep in mind these points:

* It has to be similar to the original Game Maker. It should not expand to further capabilities, within reason.
* Although it should follow the questionable design of Game Maker, it should still be using modern JavaScript standarts and coding conventions - only *simulate* how bad it is, don't actually make the code bad.
* This is very object oriented, so you can make classes even if they are not currently used in the project.
* Don't support old browsers, use new technology.
* Mainly support desktop use. Mobile is an afterthought.
* This is mainly supposed to be used as an *offline* HTML program. Make sure that, if you right click and save this thing, it can still run, without internet, in a local enviroment with no server whatsoever. That means not using XHR, unless you can provide an alternative.

### Implemented features:

* Open and save projects
* Load projects into the runner
* Load sprites into sprite resource
* Add instances to room editor

### Features to implement:

* Make object editor, with events and actions in it.
* Make "library" system, for drag and drop.
* Add Global Game Configurations
* Make string system, so this can be translated easily.
* Make windows be actual windows that float around and can be moved
* Make origin of sprite show in sprite window, and add click to select point of origin
* Show sprite of object as you hold the mouse button
* Make room editor update with sprite changes
* Everything else lol (this is will be updated with whatever I think should be added next.)