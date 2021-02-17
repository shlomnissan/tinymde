import { getTextState, getParagraph } from "./utils/edit";

import Shortcut, { initializeShortcuts } from "./shortcut";
import Commands from "./commands/commands";
import Cursor from "./utils/cursor";
import Syntax from "./utils/syntax";

const Editor = {
    editor: document.createElement("div"),
    callbacks: {},

    init: function (root) {
        this.editor.id = "tinymde-editor";
        this.editor.contentEditable = true;
        this.editor.spellcheck = false;

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
                this.editor.innerHTML = Syntax.tokenize(val);
                setTimeout(() => {
                    Cursor.setCurrentCursorPosition(
                        this.editor.innerText.length,
                        this.editor
                    );
                });
            },
            configurable: false,
            enumerable: false,
        });

        this.editor.addEventListener("keydown", (event) => {
            if (event.key.length !== 1 && event.key !== "Backspace") return;
            this.runSyntaxHighlighter();
        });

        this.editor.focus();
    },

    runSyntaxHighlighter: function () {
        setTimeout(() => {
            const container = getParagraph();
            if (container) {
                if (container.innerText.length === 0) return;
                const offset = Cursor.getCurrentCursorPosition(container);
                container.innerHTML = Syntax.tokenize(
                    container.innerText,
                    true
                );
                Cursor.setCurrentCursorPosition(offset, container);
            }
        });
    },

    addEventListener: function (event, fn) {
        this.callbacks[event] = fn;
    },

    executeCommand: function (command, value) {
        const textState = getTextState(this.editor);
        switch (command) {
            case "bold":
                Commands.Bold.execute(textState);
                break;
            case "strikethrough":
                break;
            case "italic":
                break;
            case "header":
                Commands.Header.execute(value);
                break;
            case "unordered-list":
                break;
            case "ordered-list":
                break;
            case "blockquote":
                break;
            case "link":
                break;
            default:
                console.error(`TinyMDE: ${command} is an invalid command.`);
                break;
        }
    },
};

export default Editor;

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

function clipboardPaste(editor) {
    editor.onpaste = (event) => {
        event.preventDefault();
        if (event.clipboardData) {
            const text = event.clipboardData.getData("text/plain");
            document.execCommand("insertText", false, text);
        }
    };
}
