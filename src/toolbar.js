import Commands from "./commands/commands";
import makeButton from "./utils/make_button";

/**
 * Toolbar object.
 * @constructor
 * @param {HTMLDivElement} root - The root HTML object.
 */
const Toolbar = function (root, handleCommand) {
    this.handleCommand = handleCommand;
    this.toolbar = document.createElement("div");
    this.toolbar.id = "tinymde-toolbar";
    root.append(this.toolbar);
    renderToolbar.call(this, Commands);
};

/**
 * Renders toolbar buttons.
 * @param {Object[]} commands - [ command: { id: string label: string } ].
 */
function renderToolbar(commands) {
    Object.keys(commands).forEach((cmd) => {
        const button = makeButton(Commands[cmd].label, Commands[cmd].id);
        button.onclick = () => this.handleCommand(Commands[cmd]);
        this.toolbar.append(button);
    });
}

export default Toolbar;
