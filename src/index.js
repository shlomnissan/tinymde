import Editor from "./editor";
import Toolbar from "./toolbar";

let editor;
let toolbar;

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
    toolbar = new Toolbar(root, this.handleCommand);
    editor = new Editor(root);
};

/**
 * Inserts/replaces content throught the Editor object.
 * @param {string} content - the new content.
 */
TinyMDE.prototype.setContent = function (content) {
    editor.setContent(content);
};

/**
 * Executes command through the Editor object.
 * @param {Object} cmd - { id: string, label: string }.
 */
TinyMDE.prototype.handleCommand = function (cmd) {
    editor.executeCommand(cmd);
};

export default TinyMDE;
