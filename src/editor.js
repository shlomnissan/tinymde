import { getTextState } from "./utils/textarea";

import Bold from "./commands/bold";
import Italic from "./commands/italic";
import Strikethrough from "./commands/strikethrough";
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

    this.editor.focus();
    // TODO: move caret to the end
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
 * @param {string} command
 * @param {any} value
 */
Editor.prototype.executeCommand = function (command, value) {
    const textState = getTextState(this.editor);
    switch (command) {
        case "bold":
            Bold.execute(this.editor, textState);
            break;
        case "italic":
            Italic.execute(this.editor, textState);
            break;
        case "header":
            Header.execute(this.editor, textState, value);
            break;
        case "strikethrough":
            Strikethrough.execute(this.editor, textState);
            break;
    }
};

export default Editor;
