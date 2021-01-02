import Editor from "./editor";
import Toolbar from "./toolbar";

const TinyMDE = function (editorSelector) {
    const root = document.querySelector(editorSelector);
    if (!root) {
        console.error(`'${editorSelector}' isn't a valid selector.`);
        return;
    }
    root.id = "tinymde-root";
    new Toolbar(root);
    new Editor(root);
};

export default TinyMDE;