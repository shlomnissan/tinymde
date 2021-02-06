import Editor from "./editor";
import Toolbar from "./toolbar";
import Shortcut from "./shortcut";
import { wordCount } from "./utils/string";

import "./style/theme.less";

const config = {
    showToolbar: true,
    showWordCount: false,
    toggleToolbar: false,
};

/**
 * TinyMDE object.
 * @constructor
 * @param {string} editorSelector - The class name or id of the root container.
 */
const TinyMDE = function (editorSelector) {
    const root = document.querySelector(editorSelector);
    if (!root) {
        console.error(`'${editorSelector}' isn't a valid selector.`);
        return;
    }
    root.id = "tinymde-root";
    this.config = config;
    this.editor = new Editor(root);

    if (this.config.showToolbar) {
        this.toolbar = new Toolbar(root, (command, value = null) => {
            this.editor.executeCommand(command, value);
        });

        if (this.config.toggleToolbar) {
            this.editor.addEventListener("onkeypress", () => {
                this.toolbar.hideToolbar();
            });
            this.editor.addEventListener("onmousemove", () => {
                this.toolbar.showToolbar();
            });
        }

        if (this.config.showWordCount) {
            this.editor.addEventListener("onkeyup", () => {
                this.toolbar.setWordCount(wordCount(this.editor.content));
            });
            this.toolbar.setWordCount(0);
        }
    }
};

/**
 * Inserts/replaces content throught the Editor object.
 * @param {string} content - the new content.
 */
TinyMDE.prototype.setContent = function (content) {
    this.editor.content = content;
    if (this.config.showToolbar && this.config.showWordCount) {
        this.toolbar.setWordCount(wordCount(content));
    }
};

/**
 * Registers a new shortcut for extended functionality.
 * @param {string} keys
 * @param {Function} callback
 */
TinyMDE.prototype.registerShortcut = function (keys, callback) {
    Shortcut(keys, callback);
};

export default TinyMDE;
