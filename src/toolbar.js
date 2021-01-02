import Bold from "./commands/bold";

let toolbar;

const Toolbar = function (root) {
    toolbar = document.createElement("div");
    toolbar.id = "tinymde-toolbar";
    root.append(toolbar);
    renderToolbar(toolbar);
};

function renderToolbar() {
    toolbar.append(new Bold().getElement());
}

export default Toolbar;
