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

With that in mind, just send a pull request! Or an issue. I don't know, just learn how to GitHub, noob.

## Structure of the project

There's a Game class that can run a game. It takes a project object and some HTML elements. You have to create these elements, as well as loading the project in whatever means. This means you can easily insert a game (or even multiple games) in a page without trouble.

There's an Editor class, that is the main interface for creating and running games. Here you can load and save projects, manage the resources, change the configurations, and of course, running a project as a Game class.