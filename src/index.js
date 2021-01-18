import Editor from "./editor";
import Toolbar from "./toolbar";

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
    this.editor = new Editor(root);
    toolbar = new Toolbar(root, this.handleCommand.bind(this));
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
