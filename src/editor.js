import Shortcut, { initShortcuts, deinitShortcuts } from "./shortcut";
import Commands from "./commands/commands";
import Document from "./document";

const Editor = {
    editor: document.createElement("div"),
    callbacks: {},

    init: function (root) {
        this.editor.id = "tinymde-editor";
        this.editor.contentEditable = true;
        this.editor.spellcheck = false;

        Document.init(this.editor);

        root.append(this.editor);
        initShortcuts(this.editor);
        dispatchCallbacks(this.editor, this.callbacks);
        clipboardPaste(this.editor);
        addShortcuts.apply(this);

        if (!("content" in this)) {
            Object.defineProperty(this, "content", {
                get: function () {
                    return this.editor.innerText;
                },
                set: function (val) {
                    Document.reset(val);
                    Document.render(this.editor);
                },
                configurable: false,
                enumerable: false,
            });
        }

        this.editor.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                Document.insertParagraph();
            }

            if (event.key === "Backspace") {
                if (Document.removeParagraph()) {
                    event.preventDefault();
                }
            }

            if (
                String.fromCharCode(event.keyCode).match(/(\w|\s|À|~)/g) ||
                event.key === "Backspace"
            ) {
                // if character key, update
                setTimeout(() => {
                    Document.update(event.key);
                });
            }
        });

        this.editor.focus();
    },

    addEventListener: function (event, fn) {
        this.callbacks[event] = fn;
    },

    executeCommand: function (command, value) {
        this.editor.focus();
        switch (command) {
            case "bold":
                Commands.Bold.execute();
                break;
            case "strikethrough":
                Commands.Strikethrough.execute();
                break;
            case "italic":
                break;
            case "header":
                Commands.Header.execute(value);
                break;
            case "unordered-list":
                Commands.UnorderedList.execute();
                break;
            case "ordered-list":
                Commands.OrderedList.execute();
                break;
            case "blockquote":
                Commands.Blockquote.execute();
                break;
            case "link":
                break;
            default:
                console.error(`TinyMDE: ${command} is an invalid command.`);
                break;
        }
        Document.update(" "); // " " forced update
    },

    destroy: function () {
        deinitShortcuts();
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
        document.execCommand("insertHTML", false, "&nbsp".repeat(4));
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
    Shortcut("ctrl+0", (event) => {
        event.preventDefault();
        this.executeCommand("blockquote");
    });
    Shortcut("ctrl+l", (event) => {
        event.preventDefault();
        this.executeCommand("unordered-list");
    });
    // TODO: fix three-key shortcuts
    Shortcut("ctrl+shift+l", (event) => {
        event.preventDefault();
        console.log("make ordered list");
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
