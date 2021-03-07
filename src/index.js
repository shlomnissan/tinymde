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

let root = null;

/**
 * TinyMDE object.
 * @constructor
 * @param {string} editorSelector - The class name or id of the root container.
 */
const TinyMDE = function (editorSelector, config = {}) {
    root = document.querySelector(editorSelector);
    if (!root) {
        console.error(`TinyMDE: '${editorSelector}' isn't a valid selector.`);
        return;
    }
    root.id = "tinymde-root";

    config = validateConfig(config);
    this.config = { ...__config, ...config };

    Editor.init(root);

    if (this.config.showToolbar) {
        Toolbar.init(root, this.executeCommand.bind(this));

        if (this.config.toggleToolbar) {
            Editor.addEventListener("onkeypress", () => {
                Toolbar.hide();
            });
            Editor.addEventListener("onmousemove", () => {
                Toolbar.show();
            });
        }

        if (this.config.showWordCount) {
            Editor.addEventListener("onkeyup", () => {
                Toolbar.setWordCount(wordCount(Editor.content));
            });
            Toolbar.setWordCount(0);
        }
    }
};

/**
 * Inserts/replaces content.
 * @param {string} content - the new content.
 */
TinyMDE.prototype.setContent = function (content) {
    Editor.content = content;
    if (this.config.showToolbar && this.config.showWordCount) {
        Toolbar.setWordCount(wordCount(content));
    }
};

/**
 * Returns the content as plain text.
 */
TinyMDE.prototype.getContent = function () {
    return Editor.content;
};

/**
 * Executes a command.
 * @param {string} command
 * @param {any} value - optional value.
 */
TinyMDE.prototype.executeCommand = function (command, value = "") {
    Editor.executeCommand(command, value);
};

/**
 * Registers a new shortcut for extended functionality.
 * @param {string} keys
 * @param {Function} callback
 */
TinyMDE.prototype.registerShortcut = function (keys, callback) {
    Shortcut(keys, callback);
};

/**
 * Cleanup.
 */
TinyMDE.prototype.destroy = function () {
    Editor.destroy();
    root.removeChild(Editor.editor);
    root.removeChild(Toolbar.toolbar);
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
