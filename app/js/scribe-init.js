// adapted from http://guardian.github.io/scribe/

"use strict";

var Scribe = window.Scribe;
var scribe = window.editor;

var ctrlKey = function ( event ) { 
  return event.metaKey || event.ctrlKey; 
};

var commandsToKeyboardShortcutsMap = Object.freeze({
  // cmd + b
  bold: function ( event ) { 
    return event.metaKey && event.keyCode === 66; 
  },
  // cmd + i
  italic: function ( event ) { 
    return event.metaKey && event.keyCode === 73; 
  },
  // alt + shift + s
  strikeThrough: function ( event ) {
    return event.altKey && event.shiftKey && event.keyCode === 83;
  },
  // alt + shift + a
  removeFormat: function ( event ) {
    return event.altKey && event.shiftKey && event.keyCode === 65;
  },
  // cmd + k (unless shift)
  linkPrompt: function ( event ) {
    return event.metaKey && !event.shiftKey && event.keyCode === 75;
  },
  // cmd + shift + k
  unlink: function ( event ) {
    return event.metaKey && event.shiftKey && event.keyCode === 75;
  },
  // cmd + shift + b
  insertUnorderedList: function ( event ) {
    return event.altKey && event.shiftKey && event.keyCode === 66;
  },
  // alt + shift + n
  insertOrderedList: function ( event ) {
    return event.altKey && event.shiftKey && event.keyCode === 78;
  },
  // alt + shift + w
  blockquote: function ( event ) {
    return event.altKey && event.shiftKey && event.keyCode === 87;
  },
  // ( cmd || ctl ) + 2
  h2: function ( event ) {
    return ctrlKey(event) && event.keyCode === 50;
  }
});

scribe.use( Scribe.plugins.blockquoteCommand() );
scribe.use( Scribe.plugins.headingCommand( 2 ) );
scribe.use( Scribe.plugins.headingCommand( 1 ) );
scribe.use( Scribe.plugins.intelligentUnlinkCommand() );
scribe.use( Scribe.plugins.linkPromptCommand() );
scribe.use( Scribe.plugins.smartLists() );
scribe.use( Scribe.plugins.curlyQuotes() );
scribe.use( Scribe.plugins.keyboardShortcuts( commandsToKeyboardShortcutsMap ) );

// Formatters

// hm. why you not work
try {
  scribe.use( Scribe.plugins.sanitizer({
    tags: {
      p: {},
      br: {},
      b: {},
      strong: {},
      i: {},
      strike: {},
      blockquote: {},
      ol: {},
      ul: {},
      li: {},
      a: { href: true },
      h2: {}
    }
  }));
} catch ( err ) {
  console.log( err );
  console.log( Scribe.plugins.sanitizer );
}

scribe.use( Scribe.plugins.formatterPlainTextConvertNewLinesToHtml() );