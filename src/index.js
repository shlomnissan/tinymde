import Editor from "./editor";
import Toolbar from "./toolbar";

const config = {
    showToolbar: true,
    toggleUI: true,
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
    }

    if (this.config.toggleUI) {
        this.editor.addEventListener("onkeypress", () => {
            if (this.toolbar) this.toolbar.hideToolbar();
        });
        this.editor.addEventListener("onmousemove", () => {
            if (this.toolbar) this.toolbar.showToolbar();
        });
    }
};

/**
 * Inserts/replaces content throught the Editor object.
 * @param {string} content - the new content.
 */
TinyMDE.prototype.setContent = function (content) {
    this.editor.setContent(content);
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
