import { getTextState } from "./utils/edit";

import Bold from "./commands/bold";
import Italic from "./commands/italic";
import Strikethrough from "./commands/strikethrough";
import Header from "./commands/header";

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

    this.editor.onkeypress = (event) => {
        if ("onkeypress" in this.callbacks) {
            this.callbacks.onkeypress(event);
        }
    };
    this.editor.onmousemove = (event) => {
        if ("onmousemove" in this.callbacks) {
            this.callbacks.onmousemove(event);
        }
    };
    this.editor.onkeyup = (event) => {
        if ("onkeyup" in this.callbacks) {
            this.callbacks.onkeyup(event);
        }
    };

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
    }
};

export default Editor;
