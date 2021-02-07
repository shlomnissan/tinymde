# TinyMDE
TinyMDE is a simple markdown editor with a tiny footprint. It has minimal dependencies and a collection of powerful features designed to improve the writing experience on the web.

## Features:

* Tiny footprint.
* Markdown toggle.
* Keyboard shortcuts.
* Full-screen mode.
* Inline image uploads (drag/drop)
* Tabs to space.
* New list items.
* Extensible.
* Syntax highlighting.

## Getting started:

TBC.

## Configuration:

| Param | Description | Default |
|:----------|:-------------|:------|
| `showToolbar` | Shows the default toolbar. | `true` |
| `showWordCount` | Shows the word count (default toolbar required). | `true` |
| `toggleToolbar` | Hides the toolbar when the user starts typing (reappears when the mouse moves). | `false` |

The configuration object should be passed to the constructor function:

```js
const tinymde = new TinyMDE({
    showToolbar: false
});
```

## API:

### setContent(content: string)

This function overrides the text in the editor. It's often used when the editor first initializes. For example:
```js
tinymde.setContent("**Hello World!**");
```
Note that any HTML tags will be escaped and rendered as plain text.

- - -

### getContent()

This function retrieves the content from the editor as plain text.
```js
tinymde.setContent("**TinyMDE**");
tinymde.getContent(); // returns **TinyMDE** 
```

- - -

### executeCommand(command: string, value: string | number | optional)

This function executes a command. It's often used for implementing a custom UI.

```js
tinymde.executeCommand("header", 2); // makes current selection heading 2
```

Supported commands:
- `bold`
- `italic`
- `strikethrough`
- `header`
- `unordered-list`
- `ordered-list`
- `blockquote`
- `link`
- `image`
- - -

### registerShortcut(keys: string, callback: function)

This function lets you register custom keyboard shortcuts. It accepts key combinations separated by a comma and a callback.

A common use-case for a custom shortcut is saving the text. Suppose you want to trigger a save function when the user presses `ctrl + s` or `ctrl + w`:
```js
tinymde.registerShortcut("ctrl+s, ctrl+w", (event) => {
    event.preventDefault();
    const content = tinymde.getContent();
    // save the content
});
```
Supported modifiers:
- `shift`
- `alt`, `option`
- `ctrl`, `control`
- `cmd`, `command`