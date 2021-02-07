import Editor from "./editor";
import Toolbar from "./toolbar";
import Shortcut from "./shortcut";
import { wordCount } from "./utils/string";

import "./style/theme.less";

const __config = {
    showToolbar: true,
    showWordCount: false,
    toggleToolbar: false,
};

/**
 * TinyMDE object.
 * @constructor
 * @param {string} editorSelector - The class name or id of the root container.
 */
const TinyMDE = function (editorSelector, config = {}) {
    const root = document.querySelector(editorSelector);
    if (!root) {
        console.error(`TinyMDE: '${editorSelector}' isn't a valid selector.`);
        return;
    }
    root.id = "tinymde-root";

    config = validateConfig(config);
    this.config = { ...__config, ...config };

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
 * Inserts/replaces content.
 * @param {string} content - the new content.
 */
TinyMDE.prototype.setContent = function (content) {
    this.editor.content = content;
    if (this.config.showToolbar && this.config.showWordCount) {
        this.toolbar.setWordCount(wordCount(content));
    }
};

/**
 * Returns the content as plain text.
 */
TinyMDE.prototype.getContent = function () {
    return this.editor.content;
};

/**
 * Registers a new shortcut for extended functionality.
 * @param {string} keys
 * @param {Function} callback
 */
TinyMDE.prototype.registerShortcut = function (keys, callback) {
    Shortcut(keys, callback);
};

function validateConfig(config) {
    const validParam = Object.keys(__config);
    Object.keys(config).forEach((param) => {
        if (!validParam.includes(param)) {
            console.error(
                `TinyMDE: ${param} isn't a valid configuration parameter.`
            );
            delete config[param];
        }
    });
    return config;
}

export default TinyMDE;
