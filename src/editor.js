import "./style/index.css";

let editor;

const Editor = function (root) {
    editor = document.createElement("div");
    editor.id = "tinymde-editor";
    editor.contentEditable = true;
    root.append(editor);
};

export default Editor;
