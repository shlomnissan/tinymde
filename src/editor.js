import Commands from "./commands/commands";
import { getTextState } from "./utils/textarea";

import Bold from "./commands/bold";
import Header from "./commands/header";

import "./style/theme.less";

/**
 * Editor object.
 * @constructor
 * @param {HTMLDivElement} root - The root HTML object.
 */
const Editor = function (root) {
    this.editor = document.createElement("div");
    this.editor.id = "tinymde-editor";
    this.editor.contentEditable = true;
    this.editor.spellcheck = false;
    root.append(this.editor);
};

/**
 * Inserts/replaces content.
 * @param {string} content - the new content.
 */
Editor.prototype.setContent = function (content) {
    this.editor.innerHTML = content;
};

/**
 * Executes command.
 * @param {Object} cmd - { id: string, label: string }.
 */
Editor.prototype.executeCommand = function (cmd) {
    const textState = getTextState(this.editor);
    switch (cmd) {
        case Commands.BOLD:
            Bold.execute(this.editor, textState);
            break;
        case Commands.HEADER:
            Header.execute(this.editor, textState, 1);
            break;
    }
};

export default Editor;
