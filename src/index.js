import Editor from "./editor";
import Toolbar from "./toolbar";

// private members
let editor;
let toolbar;

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

TinyMDE.prototype.setContent = function (content) {
    editor.setContent(content);
};

TinyMDE.prototype.handleCommand = function (cmd) {
    editor.executeCommand(cmd);
};

export default TinyMDE;
