import Commands from "./commands/commands";
import Bold from "./commands/bold";

import "./style/index.css";

/**
 * Editor object.
 * @constructor
 * @param {HTMLDivElement} root - The root HTML object.
 */
const Editor = function (root) {
    this.editor = document.createElement("div");
    this.editor.id = "tinymde-editor";
    this.editor.contentEditable = true;
    root.append(this.editor);
    initCommands.call(this);
};

/**
 * Inserts/replaces content.
 * @param {string} content - the new content.
 */
Editor.prototype.setContent = function (content) {
    this.editor.innerText = content;
};

/**
 * Executes command.
 * @param {Command} cmd - { id: string, label: string }.
 */
Editor.prototype.executeCommand = function (cmd) {
    this.editor.focus();
    switch (cmd) {
        case Commands.BOLD:
            this.bold.execute();
            break;
    }
};

/**
 * Instantiate command execution objects.
 */
function initCommands() {
    this.bold = new Bold();
}

export default Editor;
