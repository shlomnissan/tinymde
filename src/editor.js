import Commands from "./commands/commands";
import Bold from "./commands/bold";

import "./style/index.css";

const Editor = function (root) {
    this.editor = document.createElement("div");
    this.editor.id = "tinymde-editor";
    this.editor.contentEditable = true;
    root.append(this.editor);
    initCommands.call(this);
};

Editor.prototype.setContent = function (content) {
    this.editor.innerText = content;
};

Editor.prototype.executeCommand = function (cmd) {
    this.editor.focus();
    switch (cmd) {
        case Commands.BOLD:
            this.bold.execute();
            break;
    }
};

function initCommands() {
    this.bold = new Bold();
}

export default Editor;
