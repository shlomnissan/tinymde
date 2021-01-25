import Editor from "./editor";
import Toolbar from "./toolbar";
import { wordCount } from "./utils/string";

import "./style/theme.less";

const config = {
    showToolbar: true,
    showWordCount: true,
    toggleUI: false,
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
        this.toolbar = new Toolbar(root, this.handleCommand.bind(this));

        if (this.config.toggleUI) {
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
 * Executes command through the Editor object.
 * @param {string} command
 * @param {any} value - optional value.
 */
TinyMDE.prototype.handleCommand = function (command, value = null) {
    this.editor.executeCommand(command, value);
};

export default TinyMDE;
