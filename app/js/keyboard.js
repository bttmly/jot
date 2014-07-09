"use strict";

var app = window.app;
var Mousetrap = window.Mousetrap;

Mousetrap.bind( "command+s", function() {
  app.actions.save();
});

Mousetrap.bind( "command+o", function() {
  app.actions.open();
});

Mousetrap.bind( "command+shift+c", function() {
  app.actions.commit();
});

Mousetrap.bind( "command+shift+p", function() {
  app.actions.push();
});