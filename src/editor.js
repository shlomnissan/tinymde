import { getTextState } from "./utils/edit";

import Shortcut from "./shortcuts";
import Bold from "./commands/bold";
import Italic from "./commands/italic";
import Strikethrough from "./commands/strikethrough";
import Header from "./commands/header";
import Blockquote from "./commands/blockquote";
import Link from "./commands/link";

/**
 * Editor object.
 * @constructor
 * @param {HTMLDivElement} root - The root HTML object.
 */
const Editor = function (root) {
    this.editor = document.createElement("div");
    this.editor.id = "tinymde-editor";
    this.editor.contentEditable = true;
    this.editor.spellcheck = false;
    this.callbacks = {};

    root.append(this.editor);

    dispatchCallbacks(this.editor, this.callbacks);
    clipboardPaste(this.editor);

    Shortcut("tab", (event) => {
        console.log("boo");
    });

    Object.defineProperty(this, "content", {
        get: function () {
            return this.editor.innerText;
        },
        set: function (val) {
            this.editor.innerText = val;
        },
        configurable: false,
        enumerable: false,
    });

    this.editor.focus();
    // TODO: move caret to the end
};
/**
 * Propogate event listeners.
 * Currently supporting onkeypress, onmousemove, onkeyup.
 * @param  {string} event
 * @param  {function} fn
 */
Editor.prototype.addEventListener = function (event, fn) {
    this.callbacks[event] = fn;
};

/**
 * Executes command.
 * @param {string} command
 * @param {any} value
 */
Editor.prototype.executeCommand = function (command, value) {
    const textState = getTextState(this.editor);
    switch (command) {
        case "bold":
            Bold.execute(this.editor, textState);
            break;
        case "italic":
            Italic.execute(this.editor, textState);
            break;
        case "strikethrough":
            Strikethrough.execute(this.editor, textState);
            break;
        case "header":
            Header.execute(this.editor, textState, value);
            break;
        case "blockquote":
            Blockquote.execute(this.editor, textState);
            break;
        case "link":
            Link.execute(this.editor, textState);
            break;
    }
};

/**
 * Registers event listeners and dispatch callbacks.
 * @param  {Editor} editor
 * @param  {string: function} callbacks
 */
function dispatchCallbacks(editor, callbacks) {
    editor.onkeypress = (event) => {
        if ("onkeypress" in callbacks) {
            callbacks.onkeypress(event);
        }
    };
    editor.onmousemove = (event) => {
        if ("onmousemove" in callbacks) {
            callbacks.onmousemove(event);
        }
    };
    editor.onkeyup = (event) => {
        if ("onkeyup" in callbacks) {
            callbacks.onkeyup(event);
        }
    };
}

/**
 * Listen to onpaste and insert plain text.
 * @param  {Editor} editor
 */
function clipboardPaste(editor) {
    editor.onpaste = (event) => {
        event.preventDefault();
        if (event.clipboardData) {
            const text = event.clipboardData.getData("text/plain");
            document.execCommand("insertText", false, text);
        }
    };
}

export default Editor;
