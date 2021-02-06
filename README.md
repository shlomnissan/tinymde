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

The configuration object should be passed to the constructor function:

```js
const tinymde = new TinyMDE({
    showToolbar: false
});
```

| Param | Description | Default |
|:----------|:-------------|:------|
| `showToolbar` | Shows the default toolbar. | `true` |
| `showWordCount` | Shows the word count (default toolbar required). | `true` |
| `toggleToolbar` | Hides the toolbar when the user starts typing (reappears when the mouse moves). | `false` |

## API:

### setContent(content: string)

This function overrides the text in the editor. It's often used when the editor first initializes. For example:
```js
const tinymde = new TinyMDE("#editor", config);
tinymde.setContent("**Hello World!**);
```
Note that any HTML tags will be escaped and rendered as plain text.

- - -

### registerShortcut(keys: string, callback: function)

This function lets you register custom keyboard shortcuts. It accepts key combinations separated by a comma and a callback.

A common use-case for a custom shortcut is saving the text. Suppose you want to trigger a save function when the user presses `ctrl + s` or `ctrl + w`. This is how you would call the function:
```js
tinymde.registerShortcut("ctrl+s, ctrl+w", () => {
    // save text logic
});
```
Note that the keyboard event is not registered on the window object but the editor's object itself. If the editor is not active, the callback will not execute.
