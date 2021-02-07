import { getTextState, setSelection } from "./utils/edit";

import Shortcut, { initializeShortcuts } from "./shortcut";
import Bold from "./commands/bold";
import Italic from "./commands/italic";
import Strikethrough from "./commands/strikethrough";
import Header from "./commands/header";
import UnorderedList from "./commands/unordered_list";
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
    initializeShortcuts(this.editor);

    dispatchCallbacks(this.editor, this.callbacks);
    clipboardPaste(this.editor);
    addShortcuts.apply(this);

    Object.defineProperty(this, "content", {
        get: function () {
            return this.editor.innerText;
        },
        set: function (val) {
            this.editor.innerText = val;
            setTimeout(() => {
                setSelection({
                    start: this.editor.innerText.length,
                    end: this.editor.innerText.length,
                });
            });
        },
        configurable: false,
        enumerable: false,
    });

    this.editor.focus();
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
        case "unordered-list":
            UnorderedList.execute(this.editor, textState, "unordered");
            break;
        case "ordered-list":
            // TODO: implement
            break;
        case "blockquote":
            Blockquote.execute(this.editor, textState);
            break;
        case "link":
            Link.execute(this.editor, textState);
            break;
        default:
            console.error(`TinyMDE: ${command} is an invalid command.`);
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
 * Add keyboard shortcut combinations and trigger MD commands.
 * This function is called using .apply() to set this as the editor object.
 */
function addShortcuts() {
    Shortcut("Tab", (event) => {
        event.preventDefault();
        document.execCommand("insertHTML", false, "&#009");
    });
    Shortcut("ctrl+b", (event) => {
        event.preventDefault();
        this.executeCommand("bold");
    });
    Shortcut("ctrl+i", (event) => {
        event.preventDefault();
        this.executeCommand("italic");
    });
    Shortcut("ctrl+k", (event) => {
        event.preventDefault();
        this.executeCommand("link");
    });
    Shortcut("ctrl+1", (event) => {
        event.preventDefault();
        this.executeCommand("header", 1);
    });
    Shortcut("ctrl+2", (event) => {
        event.preventDefault();
        this.executeCommand("header", 2);
    });
    Shortcut("ctrl+3", (event) => {
        event.preventDefault();
        this.executeCommand("header", 3);
    });
    Shortcut("ctrl+4", (event) => {
        event.preventDefault();
        this.executeCommand("header", 4);
    });
    Shortcut("ctrl+5", (event) => {
        event.preventDefault();
        this.executeCommand("header", 5);
    });
    Shortcut("ctrl+6", (event) => {
        event.preventDefault();
        this.executeCommand("header", 6);
    });
    Shortcut("ctrl+l", (event) => {
        event.preventDefault();
        this.executeCommand("unordered-list");
    });
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
