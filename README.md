# TinyMDE
TinyMDE is a simple markdown editor with a tiny footprint. It has minimal dependencies and a collection of powerful features designed to improve the writing experience on the web.

## Features:

* Tiny footprint.
* Markdown toggle.
* Keyboard shortcuts.
* Full-screen mode.
* Inline image uploads.
* Tabs to space.
* New list items.
* Extensible.
* Syntax highlighting.

## Getting started:

TBC.

## Configuration:

TBC.

## API:

### setContent(content: string)

TBC.

- - -

### registerShortcut(keys: string, callback: Function)

This function lets you register custom keyboard shortcuts. It accepts key combinations separated by a comma and a callback.

A common use-case for a custom shortcut is saving the text. Suppose you want to trigger a save function when the user presses `ctrl + s` or `ctrl + w`. This is how you would call the function:
```
tinymde.registerShortcut("ctrl+s, ctrl+w", () => {
    // save text logic
});
```
Note that the keyboard event is not registered on the window object but the editor's object itself. If the editor is not active, the callback will not execute.
